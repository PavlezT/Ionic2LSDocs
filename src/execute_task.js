//Взятие задачи в работу
function GetTaskInWork(CurentTaskID, CurentUserEmail) {


	WriteHistoryAfterTaskGet(CurentTaskID);
	var oList = LSOnlineTaskData.LSContext.get_web().get_lists().getByTitle("LSTasks");
	var oListItem = oList.getItemById(CurentTaskID);
	oListItem.set_item('_Status', 'In Progress');
	var Assignet = SP.FieldUserValue.fromUser(LSOnlineTaskData.CurentUserTitle);
	////console.log(Assignet);
	oListItem.set_item('AssignedTo', Assignet);
	oListItem.set_item('AssignetToTitle', LSOnlineTaskData.CurentUserTitle);
	oListItem.set_item('AssignetToEmail', LSOnlineTaskData.CurentUserEmail);

	oListItem.update();
	LSOnlineTaskData.LSContext.load(oListItem);
	LSOnlineTaskData.LSContext.executeQueryAsync(function() {
		$('#LSDocs-bg').hide();
		$('#LSDocs').hide();
		var CurentTask = $('#Task' + CurentTaskID + '');
		$(CurentTask).remove();
		GetCountNotStartedTask(LSOnlineTaskData.CurentUserEmail, 'Not Started', 0, 0, 0);
		GetCountInWorkTask(LSOnlineTaskData.CurentUserEmail, 'In Progress', 0, 0, 0);
		$('.LSSelectTaskCard').remove();
		$('#LSSelectTaskCard' + CurentTaskID + '').remove();
		$('#TaskULDivMain' + CurentTaskID).removeClass('LSTaskULSelected');
		$('#Task' + CurentTaskID).removeClass('LSTaskSelected');
		$('.LSMyRoomBlok').removeClass('LSMyRoomBlokOpen');
		$('div[id^="Task"]').removeClass('LSTaskSelected');
		$('ul[id^="TaskULDiv"]').removeClass('LSTaskULSelected');
		if ($(window).width() > 1155) {
			$('#LSMyRoomTaskView').css('width', $(window).width());
		}
	}, function(sender, args) {
		console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
	});

}


function WriteHistoryAfterTaskGet(CurentTaskID) {
	var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/GetByTitle('LSTasks')/items?" + "$select=sysIDItem,ID,sysIDList,ContentType/Name,ContentTypeId,Title,StartDate,EstimatePlan,TaskDueDate,OData__Status,TaskAuthore/Title,TaskAuthore/EMail,AssignedToId,AssignedTo/Title,AssignedTo/EMail" + "&$expand=TaskAuthore/Title,TaskAuthore/EMail,AssignedTo/Title,AssignedTo/EMail,ContentType/Name" + "&$filter=ID eq " + CurentTaskID;
	$.ajax({
		url: requestUri,
		type: "GET",
		dataType: "json",
		headers: { Accept: "application/json;odata=verbose" },
		success: function(SelectData) {
			var EvanteDate = moment.utc().tz(LSOnlineTaskData.LSTimeZones[LSOnlineTaskData.LSCurentTimeZoneID]).format("DD.MM.YYYY HH:mm:ss");
			var StartDate = moment.utc(SelectData.d.results[0].StartDate).tz(LSOnlineTaskData.LSTimeZones[LSOnlineTaskData.LSCurentTimeZoneID]).format("DD.MM.YYYY HH:mm:ss");
			var DueDate = moment.utc(SelectData.d.results[0].TaskDueDate).tz(LSOnlineTaskData.LSTimeZones[LSOnlineTaskData.LSCurentTimeZoneID]).format("DD.MM.YYYY");

			//Запись в историю
			var StateInRouteData = {};
			StateInRouteData.sysIDList = SelectData.d.results[0].sysIDList;
			StateInRouteData.sysIDItem = SelectData.d.results[0].sysIDItem;
			StateInRouteData.EventTypeUser = 'TaskInWork'
			StateInRouteData.itemData = {
					ItemId: SelectData.d.results[0].sysIDItem, //ИД связанного документта
					ListID: SelectData.d.results[0].sysIDList, //ИД списка связанного документта
					ItemTitle: "-", //Название связанного документта
					ListTitle: "-", //Название списка связанного документта
					EventType: 'Task'
			}; //Тип записи
			StateInRouteData.HistoryArray = [{
					EventType: 'EventInWorkTask',
					Event: LSLang.Alert59, //"Задача взята в работу", //Тип действия
					NameExecutor: LSOnlineTaskData.CurentUserTitle, //Имя исполнитель
					NameAuthore: SelectData.d.results[0].TaskAuthore.Title, //Имя автора
					TaskTitle: SelectData.d.results[0].Title, //Заголовок задачи
					StartDate: StartDate, //Дата начала
					DueDate: DueDate, //Дата завершения
					EvanteDate: EvanteDate, //Дата события
					Comments: $('#CommentField').val(),
					ExecutorEmail: LSOnlineTaskData.CurentUserEmail,
					AthoreEmail: SelectData.d.results[0].TaskAuthore.EMail,
					TaskID: CurentTaskID
			}];
			StateInRouteData.HistoryType = 'HistoryDataForUser'
			LSOnlineTaskData.LSDocsWriteToHistory(StateInRouteData); //Запись созданного таска в историю документа
			StateInRouteData.HistoryType = 'TaskAndDocHistory'
			LSOnlineTaskData.LSDocsWriteToHistory(StateInRouteData); //Запись созданного таска в историю документа
			LSOnlineTaskData.LSDocsStartWriteToHistory();

			//Запись в историю

		},
		error: function(ErrorData) {
			//////console.log(ErrorData);
		}
	});



	LSDocsWriteToHistory: function(StateInRouteData) {
		var oList = LSOnlineTaskData.LSContext.get_web().get_lists().getByTitle("LSDocsListTransitHistory");

		var itemCreateInfo = new SP.ListItemCreationInformation();
		var oListItem = oList.addItem(itemCreateInfo);
		oListItem.set_item('Title', StateInRouteData.HistoryType);
		oListItem.set_item('ListID', StateInRouteData.sysIDList);
		oListItem.set_item('ItemID', StateInRouteData.sysIDItem);
		oListItem.set_item('Type', StateInRouteData.EventTypeUser);
		oListItem.set_item('historyData', JSON.stringify(StateInRouteData.HistoryArray));
		oListItem.set_item('itemData', JSON.stringify(StateInRouteData.itemData));

		oListItem.update();
		LSOnlineTaskData.LSContext.load(oListItem);
		LSOnlineTaskData.LSContext.executeQueryAsync(function() {
			console.info('<LSDocs> Start write history... / ' + new Date().format('hh.mm.ss-') + new Date().getMilliseconds());
			var Tenend = _spPageContextInfo.siteAbsoluteUrl.split('/');
			appInsights.trackEvent("WriteHistoryEvent", { User: LSOnlineTaskData.CurentUserTitle, Tenand: Tenend[2] + '/' + Tenend[3] + '/' + Tenend[4], ListID: StateInRouteData.sysIDList, DocumentID: StateInRouteData.sysIDItem }, { HistoryWriteCount: 1 });
		}, function(sender, args) {
			console.log(args.get_message());
		});
	},

	LSDocsStartWriteToHistory: function() {
		var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/GetByTitle('LSMainTransit')/items?";
		$.ajax({
			url: requestUri,
			type: "GET",
			dataType: "json",
			headers: { Accept: "application/json;odata=verbose" },
			success: function(SelectData) {
					for (var i = 0, len = SelectData.d.results.length; i < len; i++) {
						if (SelectData.d.results[i].DataSource !== 'true') {
							LSOnlineTaskData.LSContext = new SP.ClientContext();
							var oList = LSOnlineTaskData.LSContext.get_web().get_lists().getByTitle("LSMainTransit");
							var oListItem = oList.getItemById(SelectData.d.results[i].ID);
							oListItem.set_item('DataSource', 'true');
							oListItem.update();
							LSOnlineTaskData.LSContext.executeQueryAsync(function() {

							}, function(sender, args) {
									console.log(args.get_message());
							});
						}
					}

			},
			error: function(ErrorData) {
					console.error('<LSDocs><LSMainSettings> ' + ErrorData.responseJSON.error.message.value + ' : ' + new Date().format('HH:MM:ss'));
			}
		});

	},
}
