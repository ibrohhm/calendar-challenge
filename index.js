(function(){
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const MONTH_LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  const CURRENT_DATE = new Date();

  let currentMonth = CURRENT_DATE.getMonth();
  let currentYear = CURRENT_DATE.getFullYear();

  let $content = document.getElementById("content")
  let $month = document.getElementById("month")
  let $arrowUp = document.getElementById("arrow-up")
  let $arrowDown = document.getElementById("arrow-down")
  let $buttonClose = document.getElementById("button-close")
  let $buttonSave = document.getElementById("button-save")
  let $modal = document.getElementById("modal")
  let $modalDate = document.getElementById("modal-date")
  let $modalNote = document.getElementById("modal-note")

  function getMonthLength(year, month) {
    let monthLength = MONTH_LENGTHS[month]
    if(month === 1) monthLength = year%4 == 0 ? 29 : 28

    return monthLength
  }

  function generateDate(year, month, day) {
    let curMonth = month + 1
    if(curMonth.toString().length === 1) curMonth = `0${curMonth}`
    let curDay = day.toString().length === 1 ? `0${day}` : `${day}`

    return {
      date: `${year}-${curMonth}-${curDay}`,
      day: day,
      currentMonth: currentMonth === month
    }
  }

  function formatDate(date) {
    let curDate = new Date(date)
    let curDay = curDate.getDate()
    let curMonth = MONTHS[curDate.getMonth()]
    let curYear = curDate.getFullYear()

    return `${curDay} ${curMonth} ${curYear}`
  }

  function isToday(year, month, day){
    return CURRENT_DATE.getDate() === day && CURRENT_DATE.getMonth() === month && CURRENT_DATE.getFullYear() === year
  }

  function saveNote(date, note){
    localStorage.setItem(date, note);
  }

  function getNote(date){
    return localStorage.getItem(date) || '';
  }

  function getCalendar(year, month) {
    let firstDay = new Date(year, month, 1).getDay()
    let monthLength = getMonthLength(year, month)
    let prevMonth = month - 1
    let prevYear = year
    if(prevMonth === -1) {
      prevMonth = 11
      prevYear -= 1
    }
    let nextMonth = month + 1
    let nextYear = year
    if(nextMonth === 12) {
      nextMonth = 0
      nextYear += 1
    }

    let weeks = []
    let i = 1
    let j = 1
    while(weeks.length < 6) {
      let week = []
      if(weeks.length === 0) {
        let prevMonthLength = getMonthLength(prevYear, prevMonth)
        let prevDateLength = firstDay - 1 === -1 ? 6 : firstDay - 1

        for(var k=1; k<=prevDateLength; k++) {
          week.push(generateDate(prevYear, prevMonth, prevMonthLength - (prevDateLength - k)))
        }
      }

      while(week.length < 7) {
        if(i <= monthLength){
          week.push(generateDate(year, month, i))
          i += 1
        } else {
          week.push(generateDate(nextYear, nextMonth, j))
          j += 1
        }
      }

      weeks.push(week)
    }

    return weeks
  }

  function generateCalendar(year, month) {
    let weeks = getCalendar(year, month)
    let $calendar = '<div class="days"><div class="day">Mo</div><div class="day">Tu</div><div class="day">We</div><div class="day">Th</div><div class="day">Fr</div><div class="day">Sa</div><div class="day">Su</div></div>'
    
    console.log(localStorage)
    weeks.forEach(function(week){
      let $date = '<div class="dates">'
      week.forEach(function(date){
        classList = ['date']
        note = getNote(date.date)
        if(!date.currentMonth) classList.push('off')
        if(isToday(year, month, date.day)) classList.push('today')

        $date += `<div class="${classList.join(' ')}" data-date="${date.date}">${date.day}`
        if(note.length !== 0) $date += '<span>*</span>'
        $date += `</div>`
      })

      $date += '</div>'
      $calendar += $date 
    })

    $month.innerText = `${MONTHS[month]} ${year}`
    $content.innerHTML = $calendar

    let $dates = document.getElementsByClassName("date");
    Array.from($dates).forEach(function(date){
      date.addEventListener('click', function(e){
        curDate = e.target.dataset.date
        console.log(curDate, e.target.dataset)
        $modalDate.innerText = `Note - ${formatDate(curDate)}`
        $modalNote.value = getNote(curDate)
        $modal.dataset.date = curDate
        $modal.style.display = 'block'
      })
    })
  }

  function nextMonth() {
    currentMonth += 1
    if(currentMonth === 12) {
      currentMonth = 0
      currentYear += 1
    }

    generateCalendar(currentYear, currentMonth)
  }

  function prevMonth() {
    currentMonth -= 1
    if(currentMonth === -1) {
      currentMonth = 11
      currentYear -= 1
    }

    generateCalendar(currentYear, currentMonth)
  }


  generateCalendar(currentYear, currentMonth)
  $arrowUp.addEventListener("click", function(){
    prevMonth()
  });

  $arrowDown.addEventListener("click", function(){
    nextMonth()
  });

  $buttonClose.addEventListener("click", function(){
    $modal.dataset.date = ''
    $modal.style.display = 'none'
  })

  $buttonSave.addEventListener("click", function(e){
    curDate = $modal.dataset.date
    saveNote(curDate, $modalNote.value)

    $modal.dataset.date = ''
    $modal.style.display = 'none'
    generateCalendar(currentYear, currentMonth)
  })
})()
