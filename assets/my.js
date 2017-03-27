$(function() {
    var hash, changeFlag = false,
        playingFlag = false;
    var speed, PitchSign, Speaker, PitchLevel, PitchScale;
    var oberon, mordred, percival, mormna;
    var checkList = ['oberon', 'mordred', 'percival', 'mormna'];
    var voiceCount = 0,
        voices, audio;
    voices = audiojs.createAll({ trackEnded: playVoice });
    audio = voices[0];

    $("#bind-img").load(resizeHeight);
    $(window).resize(resizeHeight);
    resizeHeight();

    if (window.location.hash) {
        hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
        var urlSetting = JSON.parse('{"' + decodeURI(hash).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
            //console.log(urlSetting);
        for (var i in urlSetting) {
            $("input[name='" + i + "'][type='range']").val(urlSetting[i]);
            $("input[name='" + i + "'][type='radio'][value='" + urlSetting[i] + "']").prop('checked', true);
            $("input[name='" + i + "'][type='hidden']").val(urlSetting[i]);
            if (urlSetting[i] == '0') {
                $(".click-card[data-role='" + i + "']").addClass('hover');
            }
            //console.log("input[name='" + i + "']",urlSetting[i]);
        }

    }
    refreshSetting();

    $("body").on("change", "input", function() {
        if (playingFlag) {
            $('#play-voice').trigger('click');
        }
        window.location.hash = $("#settings").serialize();
        refreshSetting();
    });

    $(".click-card").click(function() {
        var role = $(this).data("role");
        if (role == 'percival' || role == 'mormna') {
            $(".together").toggleClass("hover");
        } else {
            $(this).toggleClass("hover");
        }
        $("input[type='hidden']").each(function() {
            $(this).val($(".click-card[data-role='" + $(this).attr('name') + "']").hasClass("hover") ? '0' : '1');
        });
        $("input[type='hidden']").trigger("change");
    });

    $('#play-voice').click(function() {
        if (playingFlag) {
            audio.pause();
            audio.currentTime = 0;
            $("#play-voice").text('播放語音').removeClass('btn-danger');
            voiceCount = 0;
            playingFlag = false;
        } else {
            $("#play-voice").text('停止播放').addClass('btn-danger');
            voiceCount = 0;
            playVoice();
        }
    });

    $('#reset').click(function() {
        $('#media').html('');
        $('form#settings')[0].reset();
        $(".click-card").removeClass('hover');
        $("input").trigger("change");
    });

    $("#share").jsSocials({
        shares: ["twitter", "facebook", "messenger", "line"]
    });

    function playVoice() {
        playingFlag = true;
        voiceCount++;
        if (voiceCount == 2 && oberon == 0 || voiceCount == 4 && mordred == 0 || voiceCount == 6 && percival == 0) {
            voiceCount++;
        }
        if (voiceCount > 7) {
            voiceCount = 0;
            playingFlag = false;
            $("#play-voice").text('播放語音').removeClass('btn-danger');
            return;
        }
        var audioSrc = 'voices/' + Speaker + '/' + voiceCount + '.mp3?032601';
        audio.load(audioSrc);
        $("audio")[0].playbackRate = speed;
        audio.play();

    }

    function refreshSetting() {
        changeFlag = true;
        speed = $("input[name='speed']").val();
        PitchSign = $("input[name='PitchSign']:checked").val();
        Speaker = $("input[name='Speaker']:checked").val();
        PitchLevel = $("input[name='PitchLevel']").val();
        PitchScale = $("input[name='PitchScale']").val();
        oberon = $("input[name='oberon']").val();
        mordred = $("input[name='mordred']").val();
        percival = $("input[name='percival']").val();
        mormna = $("input[name='mormna']").val();
        $("#sheep-text .more").hide();
        for (var i = 0; i < checkList.length; i++) {
            var check = eval(checkList[i]);
            if (check == '1') {
                $(".only-" + checkList[i]).show();
            }

        }
        $("#speed").text(speed);
        $("#PitchLevel").text(PitchLevel);
        $("#PitchScale").text(PitchScale);
    }

    function resizeHeight() {
        $('.one-card').css('height', $('.back').height());
    }
});
