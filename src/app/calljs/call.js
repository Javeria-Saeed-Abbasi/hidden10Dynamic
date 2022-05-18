function callFunc() {
  "use strict";
  setTimeout(() => {
    apiRTC.setLogLevel(10);

    var connectedSession = null;

    function showAcceptDeclineButtons() {
      $("#accept").css("display", "block");
      $("#decline").css("display", "block");
    }

    function hideAcceptDeclineButtons() {
      $("#callEnd").removeClass("hidden");
      $(".endSec").removeClass("hidden")
      $("#BntClose").removeAttr("hidden")
      $("#accept").unbind("click");
      $("#decline").unbind("click");
      $("#accept").css("display", "none");
      $("#decline").css("display", "none");
      $("#my-number").text("");
      $("#callEnd").text("Call ended by user");
    }
    $("#callEnd").on('click',function(){
        $("#callEnd").addClass("hidden");
    })

    //Function to add media stream in Div
    function addStreamInDiv(stream, divId, mediaEltId, style, muted) {
      var streamIsVideo = stream.hasVideo();

      var mediaElt = null,
        divElement = null,
        funcFixIoS = null,
        promise = null;

      if (streamIsVideo === "false") {
        mediaElt = document.createElement("audio");
        setTimeout(() => {
          $("#muteAudio").removeClass("hidden");
        });
      } else {
        mediaElt = document.createElement("video");
        setTimeout(() => {
          $("#muteAudio").removeClass("hidden");
          $("#muteVideo").removeClass("hidden");
        });
      }

      mediaElt.id = mediaEltId;
      mediaElt.autoplay = true;
      mediaElt.muted = muted;
      mediaElt.style.width = style.width;
      mediaElt.style.height = style.height;

      funcFixIoS = function () {
        var promise = mediaElt.play();

        if (promise !== undefined) {
          promise
            .then(function () {
              // Autoplay started!
              document.removeEventListener("touchstart", funcFixIoS);

              $("#status")
                .empty()
                .append("iOS / Safari : Audio is now activated");
            })
            .catch(function (error) {
              // Autoplay was prevented.

            });
        }
      };

      stream.attachToElement(mediaElt);

      divElement = document.getElementById(divId);
      $(divElement).append(mediaElt);
      promise = mediaElt.play();

      if (promise !== undefined) {
        promise
          .then(function () {
            // Autoplay started!
          })
          .catch(function (error) {

            // Autoplay was prevented.
            if (apiRTC.osName === "iOS") {
              //Show a UI element to let the user manually start playback

              //In our sample, we display a modal to inform user and use touchstart event to launch "play()"
              document.addEventListener("touchstart", funcFixIoS);
              $("#status")
                .empty()
                .append(
                  "WARNING : iOS / Safari : Audio autoplay was prevented by iOS, touch screen to activate audio"
                );
            } else {
            }
          });
      }
    }

    function setCallListeners(call) {
      call
        .on("localStreamAvailable", function (stream) {
        $("#callEnd").addClass("hidden");
          $("#ProfilePic").removeClass("hidden");
          addStreamInDiv(
            stream,
            "local-container",
            "local-media",
            { width: "200px", height: "100px" },
            true
          );
          $("#muteAudio").on("click", () => {
            $("#unmuteAudio").addClass("hidden");
            stream.muteAudio();
            $("#muteAudio").addClass("hidden");
            $("#unmuteAudio").removeClass("hidden");
          });
          $("#unmuteAudio").on("click", () => {
            $("#muteAudio").addClass("hidden");
            stream.unmuteAudio();
            $("#unmuteAudio").addClass("hidden");
            $("#muteAudio").removeClass("hidden");
          });
          $("#muteVideo").on("click", () => {
            $("#unmuteVideo").addClass("hidden");
            $("#muteVideo").addClass("hidden");
            stream.muteVideo();
            $("#unmuteVideo").removeClass("hidden");
          });
          $("#unmuteVideo").on("click", () => {
            $("#muteVideo").addClass("hidden");
            $("#unmuteVideo").addClass("hidden");
            stream.unmuteVideo();
            $("#muteVideo").removeClass("hidden");
          });
          stream.on("stopped", function () {
            //When client receives an screenSharing call from another user
            $("#closeMod").trigger("click");
            $("#local-container").empty();
          });
        })
        .on("streamAdded", function (stream) {
        $("#callEnd").addClass("hidden");
          $("#ProfilePic").addClass("hidden");
          addStreamInDiv(
            stream,
            "remote-container",
            "remote-media",
            { width: "400px", height: "200px" },
            false
          );
        })
        .on("streamRemoved", function (stream) {
          // Remove media element
          $("#remote-container").empty();
          $("#closeMod").trigger("click");
          releaseStream(stream.id);
        })
        .on("userMediaError", function (e) {
          //Checking if tryAudioCallActivated
          if (e.tryAudioCallActivated === false) {
            $("#closeMod").trigger("click");
            $("#hangup123").remove();
          }
        })
        .on("desktopCapture", function (e) {
          $("#closeMod").trigger("click");
          $("#hangup123").remove();
        })
        .on("hangup", function () {
          $("#closeMod").trigger("click");
          $("#hangup123").remove();
        });
    }

    function callInvitationProcess(invitation) {
      invitation.on("statusChange", function (statusChangeInfo) {
        if (statusChangeInfo.status === apiRTC.INVITATION_STATUS_EXPIRED) {
          // Hide accept/decline buttons
          hideAcceptDeclineButtons();
        }
      });

      //===============================================
      // ACCEPT OR DECLINE
      //===============================================
      // Display accept/decline buttons
      showAcceptDeclineButtons();
      $("#hangupButtons").addClass("hidden");
      $(".endSec").addClass("hidden");
      $("#ProfilePic").addClass("hidden");
      // Add listeners
      $("#accept").click(function () {
        setTimeout(() => {
          $("#my-number").text("");
        }, 100);
        //==============================
        // ACCEPT CALL INVITATION
        //==============================
        if (invitation.getCallType() == "audio") {
          $("#ProfilePic").removeClass("hidden");
        $("#callEnd").addClass("hidden");
          //When receiving an audio call
          var answerOptions = {
            mediaTypeForIncomingCall: "AUDIO", //Answering with audio only.
          };
          invitation.accept(null, answerOptions).then(function (call) {
            setCallListeners(call);
            addHangupButton(call.getId());
          });
        } else {

          invitation
            .accept() //Answering with audio and video.
            .then(function (call) {
              setCallListeners(call);
              addHangupButton(call.getId());
              $("#ProfilePic").addClass("hidden");
            });
        }
        // Hide accept/decline buttons
        hideAcceptDeclineButtons();
        $("#hangupButtons").removeClass("hidden");
        $("#callEnd").addClass("hidden");

        // $("#closeMod").trigger("click");
      });

      $("#decline").click(function () {
        $("#ProfilePic").addClass("hidden");
        // Decline call invitation
        setTimeout(() => {
          $("#closeMod").trigger("click");
        });
        invitation.decline();
        // Hide accept/decline buttons
        hideAcceptDeclineButtons();
      });
    }
    //==============================
    // CREATE USER AGENT
    //==============================
    var ua = new apiRTC.UserAgent({
      uri: "apzkey:myDemoApiKey",
    });
    var registerInformation = {
      id: "",
      userData: {},
      cloudFetchRetries: "",
      cloudFetchRetryDelay: "",
    };
    registerInformation.userData.username = localStorage.getItem("userData");
    registerInformation.id = localStorage.getItem("userId");
    registerInformation.userData.userConfId =
      localStorage.getItem("ProfileImage");
    registerInformation.cloudFetchRetries = 3;
    registerInformation.cloudFetchRetryDelay = 2000;
    //==============================
    // REGISTER
    //==============================
    ua.register(registerInformation)
      .then(function (session) {
        // Save session
        session.user.username = registerInformation.username;
        session.userData.username = localStorage.getItem("userData");
        session.userData.userConfId = localStorage.getItem("ProfileImage");
        connectedSession = session;
        connectedSession
          //==============================
          // WHEN A CONTACT CALLS ME
          //==============================
          .on("incomingCall", function (invitation) {
            if (window.location.href.indexOf("chat") > -1) {
              $("#ProfilePic").removeClass("hidden");
              $("#my-number").removeAttr("hidden");
              $("#my-number").text(
                invitation.sender.userData.username + " is calling you"
              );
              $("#ProfilePic").attr(
                "src",
                invitation.sender.userData.userConfId
              );
              $("#modbtn").trigger("click");
              callInvitationProcess(invitation);
            } else {
              $("#callAud").trigger("click");
              $("#my-number").removeAttr("hidden");
              $("#ProfilePic").removeClass("hidden");
              $("#my-number").text(
                invitation.sender.userData.username + " is calling you"
              );
              $("#modbtn").trigger("click");
              callInvitationProcess(invitation);
            }
          });
      })
      .catch(function (error) {

      });

    function releaseStream(streamId) {
      $("#relstream-" + streamId).remove();
      var stream = apiRTC.Stream.getStream(streamId);
      stream.release();
      $("#modbtn").trigger("click");
    }

    function addHangupButton(callId) {
      // debugger
      $("#hangupButtons").append(
        ` <button id="hangup123" class="btn" type="button" value="" style="margin:0 10px; z-index:100;"><i class="far fa-phone-slash"></i></button>
          <button id="muteAudio" class="btn hidden" type="button" value="" style="margin:0 10px; z-index:100;"><i class="far fa-microphone"></i></button>
          <button id="unmuteAudio" class="btn hidden" type="button" value="" style="margin:0 10px; z-index:100;"><i class="far fa-microphone-slash"></i></button>
          <button id="unmuteVideo" class="btn hidden" type="button" value="" style="margin:0 10px; z-index:100;"><i class="far fa-video-slash"></i></button>
          <button id="muteVideo" class="btn hidden" type="button" value="" style="margin:0 10px; z-index:100;"><i class="far fa-video"></i></button>`
      );

      $("#hangup123").on("click", () => {
        var call = connectedSession.getCall(callId);
        $("#ProfilePic").addClass("hidden");
        $("#hangup123").remove();
        call.hangUp();
        setTimeout(() => {
          $("#my-number").attr("hidden");
          $("#closeMod").trigger("click");
          $("#remote-container").empty();
          $("#local-container").empty();
        });
      });
    }

    function addReleaseStreamButton(streamId) {
      $("#streamButtons").append(
        '<input id="relstream-' +
          streamId +
          '" class="btn btn-info" type="button" value="relstream-' +
          streamId +
          '" onclick="releaseStream(' +
          streamId +
          ')" />'
      );
    }

    //Audio Call establishment
    $("#callAudio").click(function () {
      $(".endSec").addClass("hidden");

      $("#ProfilePic").removeClass("hidden");
      $("#modbtn").trigger("click");
      var contact = connectedSession.getOrCreateContact($("#number").val());
      var callOptions = {
        mediaTypeForOutgoingCall: "AUDIO",
      };
      var call = contact.call(null, callOptions);
      if (call !== null) {
        setCallListeners(call);
        addHangupButton(call.getId());
      } else {
        $("#closeMod").trigger("click");
      }
    });

    //Call establishment
    $("#callVideo").click(function () {
      $(".endSec").addClass("hidden");
      $("#modbtn").trigger("click");
      var contact = connectedSession.getOrCreateContact($("#number").val());
      var call = contact.call();

      if (call !== null) {
        setCallListeners(call);
        addHangupButton(call.getId());
      } else {
        $("#closeMod").trigger("click");
      }
    });
  }, 1000);
}
