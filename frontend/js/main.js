(async function () {
  const SERVER_URL = 'http://localhost:3000',
    $clientsSearch = document.querySelector('.header__input'),
    $addClientButton = document.getElementById('hero__btn'),
    $page = document.getElementById('page'),
    $main = document.getElementById('main'),
    $heroTbody = document.getElementById('hero__tbody'),
    $heroThId = document.getElementById('hero__th--id'),
    $heroId = document.getElementById('hero__id'),
    $heroThFio = document.getElementById('hero__th--fio'),
    $heroFio = document.getElementById('hero__fio'),
    $heroThDateCreate = document.getElementById('hero__th--date-create'),
    $heroDateCreate = document.getElementById('hero__date-create'),
    $heroThDateChange = document.getElementById('hero__th--date-change'),
    $heroDateChange = document.getElementById('hero__date-change');
  // добавление клиента на сервер
  async function serverAddClient(obj) {
    let response = await fetch(SERVER_URL + '/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj),
    })
    let data = await response.json()
    return data
  }
  // получение объекта
  async function serverGetClients() {
    let response = await fetch(SERVER_URL + '/api/clients', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    let data = await response.json()
    return data
  }
  // удаление клиента по id
  async function serverDeleteClient(id) {
    let response = await fetch(SERVER_URL + '/api/clients/' + id, {
      method: 'DELETE',
    })
    let data = await response.json()
    return data
  }
  // поулчение данных о клиенте по id
  async function serverGetClientData(id) {
    let response = await fetch(SERVER_URL + '/api/clients/' + id, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    let data = await response.json()
    return data
  }
  // изменение или обновление данных о клиенте по id
  async function serverChangeClient(id, obj) {
    let response = await fetch(SERVER_URL + '/api/clients/' + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj),
    })
    let data = await response.json()
    return data
  }
  // обновление данных
  let serverData = await serverGetClients(),
    listData = [];
  if (serverData) {
    listData = serverData
  }
  async function update() {
    serverData = await serverGetClients()
    listData = serverData
    if ($clientsSearch.value == '') {
      render(listData)
    } else {
      displayMatchClient()
    }
  }
  // стоп скролл
  function stopScroll() {
    $page.classList.add('stop-scroll')
  }
  function returnScroll() {
    $page.classList.remove('stop-scroll')
  }
  // попап
  const $popup = document.createElement('div'),
    $popupBody = document.createElement('div'),
    $popupDescr = document.createElement('span'),
    $popupForm = document.createElement('form'),
    $inputLabelSurname = document.createElement('label'),
    $inputSurname = document.createElement('input'),
    $inputPlaceholderSurname = document.createElement('span'),
    $inputLabelName = document.createElement('label'),
    $inputName = document.createElement('input'),
    $inputPlaceholderName = document.createElement('span'),
    $inputLabelLastname = document.createElement('label'),
    $inputLastName = document.createElement('input'),
    $inputPlaceholderLastname = document.createElement('span'),
    $popupContactsWrapper = document.createElement('div'),
    $popupBtnAddContact = document.createElement('button'),
    $popupBtnSave = document.createElement('button'),
    $popupBtnCancel = document.createElement('button'),
    $popupBtnClose = document.createElement('button'),
    $popupClientId = document.createElement('span'),
    $popupBtnAmend = document.createElement('button'),
    $popupClientDelete = document.createElement('button')
  // попап изменения клиента
  function changeClientPopup(oneClient) {
    createPopup()
    $popupClientId.classList.add('popup__id')
    $popupBtnAmend.classList.add('popup__btn')
    $popupClientDelete.classList.add('popup__btn--cancel')

    $popupDescr.textContent = 'Изменить данные'
    $popupBtnAmend.textContent = 'Сохранить'
    $popupClientDelete.textContent = 'Удалить клиента'
    $popupClientId.textContent = `ID: ${oneClient.id}`

    $inputSurname.value = oneClient.surname
    $inputName.value = oneClient.name
    $inputLastName.value = oneClient.lastName

    $popupBtnSave.remove()
    $popupBtnCancel.remove()
    $popupDescr.append($popupClientId)
    $popupForm.append($popupBtnAmend)
    $popupBody.append($popupClientDelete)
    if (contacts) {
      for (let i = 0; i < oneClient.contacts.length; i++) {
        addContactInput()
        contacts[i].childNodes[0].childNodes[0].childNodes[1].innerText = oneClient.contacts[i].type
        contacts[i].childNodes[1].value = oneClient.contacts[i].value
      }
    }
    $popupBtnAmend.addEventListener('click', async function (e) {
      e.preventDefault()
      contactsData()
      if (newClientAddData == undefined) return
      await serverChangeClient(oneClient.id, newClientAddData)
      update()
      popupClose()
    })
    $popupClientDelete.addEventListener('click', deletePopupClient)
  }
  // добавление попапа
  function createPopup() {
    $popup.classList.add('popup')
    $popupBody.classList.add('popup__body')
    $popupDescr.classList.add('popup__pescr')
    $popupForm.classList.add('popup__form')
    $inputLabelSurname.classList.add('input__label')
    $inputSurname.classList.add('popup__input')
    $inputPlaceholderSurname.classList.add('input__placeholder')
    $inputLabelName.classList.add('input__label')
    $inputName.classList.add('popup__input')
    $inputPlaceholderName.classList.add('input__placeholder')
    $inputLabelLastname.classList.add('input__label')
    $inputLastName.classList.add('popup__input')
    $inputPlaceholderLastname.classList.add('input__placeholder')
    $popupContactsWrapper.classList.add('pupup__contacts--wrapper')
    $popupBtnAddContact.classList.add('popup__btn--add-contact')
    $popupBtnSave.classList.add('popup__btn')
    $popupBtnClose.classList.add('popup__btn--close')
    $popupBtnCancel.classList.add('popup__btn--cancel')

    $popupDescr.textContent = 'Новый клиент'
    $popupBtnAddContact.textContent = 'Добавить контакт'
    $inputPlaceholderLastname.textContent = 'Отчество'
    $popupBtnSave.textContent = 'Сохранить'
    $popupBtnCancel.textContent = 'Отмена'

    $popupBtnAddContact.type = 'button'
    $inputSurname.type = 'text'
    $inputName.type = 'text'
    $inputLastName.type = 'text'
    $popupBtnSave.type = 'button'
    $inputSurname.placeholder = ' '
    $inputName.placeholder = ' '
    $inputLastName.placeholder = ' '

    $popupClientId.remove()
    $popupBtnAmend.remove()
    $popupClientDelete.remove()
    $main.append($popup)
    $popup.append($popupBody)
    $popupBody.append($popupDescr)
    $popupBody.append($popupForm)
    $popupForm.append($inputLabelSurname)
    $inputLabelSurname.append($inputSurname)
    $inputLabelSurname.append($inputPlaceholderSurname)
    $inputPlaceholderSurname.textContent = 'Фамилия'
    $popupForm.append($inputLabelName)
    $inputLabelName.append($inputName)
    $inputLabelName.append($inputPlaceholderName)
    $inputPlaceholderName.textContent = 'Имя'
    $inputLabelLastname.append($inputLastName)
    $inputLabelLastname.append($inputPlaceholderLastname)
    $popupForm.append($inputLabelLastname)
    $popupBody.append($popupContactsWrapper)
    $popupForm.append($popupContactsWrapper)
    $popupForm.append($popupBtnAddContact)
    $popupForm.append($popupBtnSave)
    $popupBody.append($popupBtnCancel)
    $popupBody.append($popupBtnClose)
  }
  // кнопка добавления инпута с контактом
  $popupBtnAddContact.addEventListener('click', addContactInput)
  let contacts = []
  // создание импута с контактом
  function addContactInput() {
    this.style = 'padding-bottom: 25px'
    const $popupContacts = document.createElement('div'),
      $popupSelect = document.createElement('select'),
      $popupSelectItemTel = document.createElement('option'),
      $popupSelectItemTel2 = document.createElement('option'),
      $popupSelectItemEmail = document.createElement('option'),
      $popupSelectItemVk = document.createElement('option'),
      $popupSelectItemFacebook = document.createElement('option'),
      $popupSelectInput = document.createElement('input'),
      $popupBtnCloseInput = document.createElement('button');

    $popupContacts.classList.add('popup__contacts')
    $popupSelect.classList.add('selectCustom')
    $popupSelectInput.classList.add('popup__contacts--input')
    $popupBtnCloseInput.classList.add('popup__contacts--btn')

    $popupBtnCloseInput.type = 'button'
    $popupSelectInput.type = 'text'
    $popupSelectInput.placeholder = 'Введите данные контакта'

    $popupSelectItemTel.textContent = 'Телефон'
    $popupSelectItemTel2.textContent = 'Доп.контакт'
    $popupSelectItemEmail.textContent = 'Email'
    $popupSelectItemVk.textContent = 'Vk'
    $popupSelectItemFacebook.textContent = 'Facebook'
    // ограничение открытых пустых инпутов при добавлении новых
    if (contacts[contacts.length - 1]) {
      for (let i = 0; i < contacts.length; i++) {
        if (contacts[i].childNodes[1].value.trim()) { }
        else {
          alert('Сначала заполните пустой контакт')
          return
        }
      }
    }
    // ограничение макс количества контактов
    if (contacts.length >= 9) {
      $popupBtnAddContact.style = 'display: none'
    }
    $popupContacts.append($popupSelect)
    $popupSelect.append($popupSelectItemTel)
    $popupSelect.append($popupSelectItemTel2)
    $popupSelect.append($popupSelectItemEmail)
    $popupSelect.append($popupSelectItemVk)
    $popupSelect.append($popupSelectItemFacebook)
    $popupContacts.append($popupSelectInput)
    $popupContacts.append($popupBtnCloseInput)
    $popupContactsWrapper.append($popupContacts)
    contacts.push($popupContacts)
    // инициализация choises плагина для селекта
    const currentChoise = contacts[contacts.length - 1].childNodes[0],
      choices = new Choices(currentChoise, {
        searchEnabled: false,
        allowHTML: true,
        sorter: function () {
        },
        itemSelectText: '',
      });
    // закрытие инпута с контактом
    $popupBtnCloseInput.addEventListener('click', function () {
      this.parentElement.style = 'transform: scale(0); opacity: 0; max-height: 0'
      function removeClientItem() {
        $popupContacts.remove()
      }
      setTimeout(removeClientItem, 150);
      for (let i = 0; i < contacts.length; i++) {
        if (contacts[i].childNodes[1] == this.parentElement.childNodes[1]) {
          contacts.splice(i, 1)
          if (contacts.length >= 9) {
            $popupBtnAddContact.style = 'display: flex'
          }
        }
      }
      if (!contacts[0]) {
        $popupBtnAddContact.style = 'padding-bottom: 8px'
      }
    })
  }
  // добавление попапа по нажатию
  $addClientButton.addEventListener('click', function () {
    stopScroll()
    createPopup()
  })
  // закрытие попапа
  function popupClose() {
    returnScroll()
    $inputSurname.value = ''
    $inputName.value = ''
    $inputLastName.value = ''
    $popup.remove()
    $popupBtnAddContact.style = 'padding-bottom: 8px'
    $popupContactsWrapper.innerHTML = ''
    contacts = []
  }
  $popupBtnClose.addEventListener('click', popupClose)
  $popupBtnCancel.addEventListener('click', popupClose)
  $popup.addEventListener('click', e => {
    const target = e.target
    if (!target.closest('.popup__body') && !target.closest('.popup__contacts')) {
      popupClose()
    }
  });
  // информация о контактах
  function contactsData() {
    // валидация
    if (!$inputSurname.value.trim()) {
      alert('Фамилия не введена!')
      return
    }
    if (!$inputName.value.trim()) {
      alert('Имя не введено!')
      return
    }
    // добавление контактов
    let currentContacts = []
    let arrContactsItems = [...contacts]
    let filterContactsArrItems = arrContactsItems.filter(arrContactsItem => arrContactsItem.childNodes[1].value.trim())
    for (let i = 0; i < filterContactsArrItems.length; i++) {
      currentContacts.push({ type: filterContactsArrItems[i].childNodes[0].childNodes[0].childNodes[1].innerText, value: filterContactsArrItems[i].childNodes[1].value })
    }
    // добавление фио
    let newClientObject = {
      name: $inputName.value.trim().substring(0, 1).toUpperCase() + $inputName.value.trim().substring(1).toLowerCase(),
      surname: $inputSurname.value.trim().substring(0, 1).toUpperCase() + $inputSurname.value.trim().substring(1).toLowerCase(),
      lastName: $inputLastName.value.trim().substring(0, 1).toUpperCase() + $inputLastName.value.trim().substring(1).toLowerCase(),
      contacts: currentContacts
    }
    newClientAddData = newClientObject
  }
  // добавление данных с формы на сервер
  let newClientAddData
  $popupBtnSave.addEventListener('click', async function (e) {
    e.preventDefault()
    contactsData()
    if (newClientAddData == undefined) return
    await serverAddClient(newClientAddData)
    update()
    popupClose()
  })
  // создание клиента
  function createClientTr(oneClient) {
    const $tr = document.createElement('tr'),
      $tdId = document.createElement('td'),
      $tdSnl = document.createElement('td'),
      $tdTimeCreate = document.createElement('td'),
      $grayColorTimeCreate = document.createElement('span'),
      $tdTimeChange = document.createElement('td'),
      $grayColorTimeChange = document.createElement('span'),
      $tdContacts = document.createElement('td'),
      $tdContactsWrapper = document.createElement('div'),
      $tdAction = document.createElement('td'),
      $tdBtnsWrapper = document.createElement('div'),
      $tdBtnEdit = document.createElement('button'),
      $tdSvgEdit = document.createElement('div'),
      $tdBtnCancel = document.createElement('button'),
      $tdSvgCancel = document.createElement('div');

    $tr.classList.add('hero__tr')
    $tdId.classList.add('hero__td')
    $tdSnl.classList.add('hero__td')
    $tdTimeCreate.classList.add('hero__td')
    $grayColorTimeCreate.classList.add('gray--color')
    $tdTimeChange.classList.add('hero__td')
    $grayColorTimeChange.classList.add('gray--color')
    $tdContacts.classList.add('hero__td')
    $tdContactsWrapper.classList.add('hero__contacts--wrapper')
    $tdAction.classList.add('hero__td')
    $tdBtnsWrapper.classList.add('hero__btns--wrapper')
    $tdBtnEdit.classList.add('hero__btn--edit')
    $tdSvgEdit.classList.add('hero__svg--edit')
    $tdBtnCancel.classList.add('hero__btn--cancel')
    $tdSvgCancel.classList.add('hero__svg--cancel')

    $tdId.textContent = oneClient.id
    $tdSnl.textContent = oneClient.fio
    $tdTimeCreate.textContent = oneClient.createdDate
    $grayColorTimeCreate.textContent = oneClient.createdTime
    $tdTimeChange.textContent = oneClient.updatedDate
    $grayColorTimeChange.textContent = oneClient.updatedTime
    $tdBtnEdit.textContent = 'Изменить'
    $tdBtnCancel.textContent = 'Удалить'
    // вывод контактов
    for (let i = 0; i < oneClient.contacts.length; i++) {
      // телефон
      if (oneClient.contacts[i].type === 'Телефон') {
        const $heroContact = document.createElement('button');
        $heroContact.id = "hero__contact--tel"
        $heroContact.classList.add('hero__contact--tel')
        $tdContactsWrapper.append($heroContact)
        tippy($heroContact, {
          content: `tel: <a class="hero__contact--link" href="tel:${oneClient.contacts[i].value}">${oneClient.contacts[i].value}</a>`,
          allowHTML: true,
          interactive: true,
        });
      }
      // доп контакт
      if (oneClient.contacts[i].type === 'Доп.контакт') {
        const $heroContact = document.createElement('button');
        $heroContact.id = "hero__contact"
        $heroContact.classList.add('hero__contact')
        $tdContactsWrapper.append($heroContact)
        tippy($heroContact, {
          content: `Contact: <a class="hero__contact--link" href="${oneClient.contacts[i].value}" target="_blank">${oneClient.contacts[i].value}</a>`,
          allowHTML: true,
          interactive: true
        });
      }
      // Email
      if (oneClient.contacts[i].type === 'Email') {
        const $heroContact = document.createElement('button');
        $heroContact.id = "hero__contact--email"
        $heroContact.classList.add('hero__contact--email')
        $tdContactsWrapper.append($heroContact)
        tippy($heroContact, {
          content: `email: <a class="hero__contact--link" href="${oneClient.contacts[i].value}">${oneClient.contacts[i].value}</a>`,
          allowHTML: true,
          interactive: true,
        });
      }
      // ВК
      if (oneClient.contacts[i].type === 'Vk') {
        const $heroContact = document.createElement('button');
        $heroContact.id = "hero__contact--vk"
        $heroContact.classList.add('hero__contact--vk')
        $tdContactsWrapper.append($heroContact)
        tippy($heroContact, {
          content: `Vk: <a class="hero__contact--link" href="${oneClient.contacts[i].value}" target="_blank">${oneClient.contacts[i].value}</a>`,
          allowHTML: true,
          interactive: true,
        });
      }
      // facebook
      if (oneClient.contacts[i].type === 'Facebook') {
        const $heroContact = document.createElement('button');
        $heroContact.id = "hero__contact--fb"
        $heroContact.classList.add('hero__contact--fb')
        $tdContactsWrapper.append($heroContact)
        tippy($heroContact, {
          content: `facebook: <a class="hero__contact--link" href="${oneClient.contacts[i].value}">${oneClient.contacts[i].value}</a>`,
          allowHTML: true,
          interactive: true,
        });
      }
    }
    $tr.append($tdId)
    $tr.append($tdSnl)
    $tr.append($tdTimeCreate)
    $tdTimeCreate.append($grayColorTimeCreate)
    $tr.append($tdTimeChange)
    $tdTimeChange.append($grayColorTimeChange)
    $tr.append($tdContacts)
    $tdContacts.append($tdContactsWrapper)
    $tr.append($tdAction)
    $tdAction.append($tdBtnsWrapper)
    $tdBtnsWrapper.append($tdBtnEdit)
    $tdBtnEdit.append($tdSvgEdit)
    $tdBtnsWrapper.append($tdBtnCancel)
    $tdBtnCancel.append($tdSvgCancel)
    // открытие попапа для изменения данных о клиенте
    $tdBtnEdit.addEventListener('click', function (e) {
      tdTarget = $tr
      stopScroll()
      changeClientPopup(oneClient);
    })
    // открытие попапа удаления клиента
    $tdBtnCancel.addEventListener('click', function () {
      tdTarget = $tr
      stopScroll()
      deletePopupClient()
    })
    // кнопка удаления клиента
    $deletePopupBtn.addEventListener('click', deleteClient)
    // закрытие попапа удаления
    function deletePopupClose() {
      $deletePopup.remove()
      returnScroll()
    }
    $cancelDeletePopupBtn.addEventListener('click', deletePopupClose)
    $closeDeletePopupBtn.addEventListener('click', deletePopupClose)
    $deletePopup.addEventListener('click', e => {
      const target = e.target
      if (!target.closest('.popup-delete__body')) {
        deletePopupClose()
      }
    });
    return $tr
  }
  // удаления клиента
  let tdTarget
  async function deleteClient() {
    await serverDeleteClient(tdTarget.childNodes[0].innerText)
    update()
    popupClose()
    tdTarget.remove()
    returnScroll()
    $deletePopup.remove()
  }
  // попап удаления клиента
  const $deletePopup = document.createElement('div'),
    $deletePopupBody = document.createElement('div'),
    $deletePopupTitle = document.createElement('h3'),
    $deletePopupDescr = document.createElement('span'),
    $deletePopupBtn = document.createElement('button'),
    $cancelDeletePopupBtn = document.createElement('button'),
    $closeDeletePopupBtn = document.createElement('button');
  function deletePopupClient() {
    $deletePopup.classList.add('popup')
    $deletePopupBody.classList.add('popup-delete__body')
    $deletePopupTitle.classList.add('popup-delete__title')
    $deletePopupDescr.classList.add('popup-delete__descr')
    $deletePopupBtn.classList.add('popup__btn')
    $cancelDeletePopupBtn.classList.add('popup__btn--cancel')
    $closeDeletePopupBtn.classList.add('popup__btn--close')

    $deletePopupTitle.textContent = 'Удалить клиента'
    $deletePopupDescr.textContent = 'Вы действительно хотите удалить данного клиента?'
    $deletePopupBtn.textContent = 'Удалить'
    $cancelDeletePopupBtn.textContent = 'Отмена'

    $main.append($deletePopup)
    $deletePopup.append($deletePopupBody)
    $deletePopupBody.append($deletePopupTitle)
    $deletePopupBody.append($deletePopupDescr)
    $deletePopupBody.append($deletePopupBtn)
    $deletePopupBody.append($cancelDeletePopupBtn)
    $deletePopupBody.append($closeDeletePopupBtn)
  }
  // поиск клиентов
  let inputDelay
  function matchWord(word, clients) {
    return clients.filter(c => {
      const regex = new RegExp(word, 'gi')
      return c.name.match(regex) || c.id.match(regex) || c.surname.match(regex) || c.lastName.match(regex)
    })
  }
  async function displayMatchClient() {
    const filteredClients = matchWord($clientsSearch.value, await serverGetClients())
    render(filteredClients)
  }
  $clientsSearch.addEventListener('input', function () {
    clearTimeout(inputDelay);
    inputDelay = setTimeout(displayMatchClient, 300)
  })
  // сортировка
  function sortClients(arr, func) {
    let result = [...arr]
    for (j = 0; j < result.length; j++) {
      for (let i = 0; i < result.length - 1; i++) {
        if (func(result[i], result[i + 1])) {
          let temp = result[i]
          result[i] = result[i + 1]
          result[i + 1] = temp
        }
      }
    }
    return result
  }
  function sortByHigh() {
    return sortClients(listData, function (a, b) {
      return a.id < b.id
    })
  }
  function sortByLow() {
    return sortClients(listData, function (a, b) {
      return a.id > b.id
    })
  }
  function ckickThSort(thButton, sortFunc1, sortFunc2) {
    if (thButton.closest('.hero__th--toggle')) {
      thButton.classList.remove('hero__th--toggle')
      render(sortFunc1())
      return
    }
    thButton.classList.add('hero__th--toggle')
    render(sortFunc2())
  }
  // клики сортировки
  $heroThId.addEventListener('click', function () {
    ckickThSort($heroId, sortByLow, sortByHigh)
  })
  $heroThFio.addEventListener('click', function () {
    ckickThSort($heroFio, sortByHigh, sortByLow)
  })
  $heroThDateCreate.addEventListener('click', function () {
    ckickThSort($heroDateCreate, sortByHigh, sortByLow)
  })
  $heroThDateChange.addEventListener('click', function () {
    ckickThSort($heroDateChange, sortByHigh, sortByLow)
  })
  // render
  async function render(clientsArr) {
    $heroTbody.innerHTML = ''
    // подготовка + отрисовка
    let copyListData = [...clientsArr]
    for (const oneClient of copyListData) {
      oneClient.fio = `${oneClient.surname} ${oneClient.name} ${oneClient.lastName}`
      oneClient.createdDate = `${oneClient.createdAt.slice(8, 10)}.${oneClient.createdAt.slice(5, 7)}.${oneClient.createdAt.slice(0, 4)}`
      oneClient.createdTime = oneClient.createdAt.slice(11, 16)
      oneClient.updatedDate = `${oneClient.updatedAt.slice(8, 10)}.${oneClient.updatedAt.slice(5, 7)}.${oneClient.updatedAt.slice(0, 4)}`
      oneClient.updatedTime = oneClient.updatedAt.slice(11, 16)
      const $newClient = createClientTr(oneClient)
      $heroTbody.append($newClient)
    }
  }
  render(listData)
})();
