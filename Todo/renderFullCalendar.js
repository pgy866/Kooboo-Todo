/** render fullCalendar plug */
$(document).ready(function() {
  var touristClassIsloaded = true
  $("#date-dd-task").on('shown.bs.tab',function(e) {
    if(touristClassIsloaded){
      touristClassIsloaded = false
      var calendarEl = document.getElementById('full-calendar');
      var calendar = new FullCalendar.Calendar(calendarEl, {
          header: {
            left: 'today',
            center: 'title',
            right: 'prev,next'
          },
          contentHeight: 480,
          editable: false,
          selectable: true,
          eventLimit: true,
          events: function (start, end) {
            // Render events that require reminders in the calendar
            axios.get('/api/remindTask/get').then((res) => {
                if(res.data.success) {
                    end(res.data.model)
                }
            }).catch(error => console.log(error))
          }
        })
        calendar.render()
    }
  })
})