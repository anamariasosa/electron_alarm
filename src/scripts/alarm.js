var i = 0;
var time_interval;
var text_interval;
var $animated = $('.animated')
var $alarm_config_button = $('.alarm_config');
var $alarm_title = $('.alarm_title');
var $alarm_song = $('.alarm_song');
var $alarm_btn_stop = $('.alarm_btn-stop');
var $alarm_settings_container = $('.alarm_settings-container')

// This method get the local time and compare with the time selected
function verify_alarm () {
  var date = new Date();
  var hour_now = date.getHours()
  var minutes_now = date.getMinutes()
  var hour_selected = localStorage.getItem("alarm_hour");
  var minutes_selected = localStorage.getItem("alarm_minutes");
  if (hour_now == hour_selected && minutes_now == minutes_selected ){
    play_music();
  } else {
    show_alarm_hour();
  }
}

// This method is called when the local time is not the time selected
function show_alarm_hour () {
  // Show the configuration button
  $alarm_config_button.removeClass('hidden');
  // Show message
  $alarm_title.text('The alarm will ring at \n'
                    + localStorage.getItem("alarm_hour")
                    + ':'
                    + localStorage.getItem("alarm_minutes"));
}

// This method is called when the local time is the time selected
function play_music () {
  clearInterval(time_interval);
  // Hide the configuration button
  $alarm_config_button.addClass('hidden');
  // Show 'wake up' message with some animate.css effects
  $alarm_title
              .addClass('animated infinite swing')
              .css('margin-top', '48px')
              .removeClass('bounceOutDown bounceInDown bounceInUp')
              .text('Wake up!');
  // Play the song
  $alarm_song
              .get(0)
              .play();
  // Show the button to stop the alarm
  $alarm_btn_stop
              .removeClass('hidden')
              .addClass('animated pulse')
              .fadeIn('fast', 1000);
}

// This method stop the alarm
function stop_alarm (event) {
  event.preventDefault();
  // Hide the button 'stop'
  $alarm_btn_stop.addClass('hidden');
  // Stop the song
  $alarm_song
            .get(0)
            .pause();
  // Add some animate.css effects
  $alarm_title
            .removeClass('infinite swing')
            .addClass('bounceOutDown');
  $alarm_btn_stop.fadeOut('fast', function() {
    setTimeout( show_message , 1000);
  });
}

// This method is called when the user stop the alarm
function show_message() {

  $alarm_title
    .removeClass('bounceOutDown bounceInUp')
    .css('margin-top', '50px')
    .text('Good Morning');

  // Show some messages  each 2 seconds
  text_interval  = setInterval(messages_list, 2000);
}

// This method show greetings messages in 4 different languages
function messages_list () {
  var greetings = [ 'Buenos Días',
                    'Bonjour',
                    'Bon dia',
                    'Guten Morgen',
                  ]

  if (i < greetings.length ){
    $('.animated').css('animation-duration', '2s');
    $alarm_title
              .addClass('fadeIn infinite')
              .text(greetings[i]);
    i++;
  } else {
    clearInterval(text_interval);
    $alarm_title.removeClass('fadeIn infinite')
    $('.animated').css('animation-duration', '1s');
    $alarm_config_button.removeClass('hidden');
  }
}

// This method show the input to set the alarm
function edit_time (event) {
  event.preventDefault();
  i = 0;
  var $hour_selected = localStorage.getItem("alarm_hour");
  var $minutes_selected = localStorage.getItem("alarm_minutes");
  $alarm_title.addClass('animated bounceOutUp')
  setTimeout(form_animations, 'fast');
  if ( $hour_selected  != null)
    $('.alarm_time-input').val($hour_selected + ':' + $minutes_selected);
}

function form_animations () {
  $alarm_title.addClass('hidden');
  $alarm_settings_container
                  .removeClass('hidden')
                  .addClass('animated  fadeInDownBig')
                  .css('margin-top', '50px');
}

function setTime () {
  event.preventDefault();
  save_time();
  time_interval = setInterval( verify_alarm, 400);
  time_animation();
}

function time_animation () {
  $alarm_title
    .removeClass('hidden bounceOutUp')
    .addClass('bounceInDown')

  $alarm_settings_container.removeClass('animated  fadeInDownBig')
  setTimeout(function () {
    $alarm_settings_container.addClass('hidden')
  }, 'fast');
}

function save_time () {
  var alarm_hour_val = $('.alarm_time-input').val();
  var alarmHour = alarm_hour_val.slice(0, 2);
  var alarm_minutes = alarm_hour_val.slice(3, 5);
  localStorage.setItem("alarm_hour", alarmHour);
  localStorage.setItem("alarm_minutes", alarm_minutes);
}

function close_window (event) {
  event.preventDefault();
  window.close();
}

function init () {
  if (localStorage.getItem("alarm_hour") == null) {
    $alarm_settings_container
      .removeClass('hidden')
      .addClass('animated  fadeInDownBig')
  } else {
    verify_alarm();
  }
}

$alarm_btn_stop.on('click', stop_alarm );
$('.alarm_close-btn').on('click', close_window);
$('.alarm_config').on('click', edit_time);
$('.alarm_save-btn').on('click', setTime);
$(document).ready(init);
