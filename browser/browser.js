var CkEditorLinkBrowser = {};

CkEditorLinkBrowser.folders = [];
CkEditorLinkBrowser.links = {}; //folder => list of images
CkEditorLinkBrowser.ckFunctionNum = null;

CkEditorLinkBrowser.$folderSwitcher = null;
CkEditorLinkBrowser.$linkContainer = null;

CkEditorLinkBrowser.init = function () {
	CkEditorLinkBrowser.$folderSwitcher = $('#js-folder-switcher');
	CkEditorLinkBrowser.$linkContainer = $('#js-links-container');

	var baseHref = CkEditorLinkBrowser.getQueryStringParam("baseHref");
	if (baseHref) {
		var h = (document.head || document.getElementsByTagName("head")[0]),
			el = h.getElementsByTagName("link")[0];
		el.href = location.href.replace(/\/[^\/]*$/,"/browser.css");
		(h.getElementsByTagName("base")[0]).href = baseHref;
	}

	CkEditorLinkBrowser.ckFunctionNum = CkEditorLinkBrowser.getQueryStringParam('CKEditorFuncNum');

	CkEditorLinkBrowser.initEventHandlers();

	CkEditorLinkBrowser.loadData(CkEditorLinkBrowser.getQueryStringParam('listUrl'), function () {
		CkEditorLinkBrowser.initFolderSwitcher();
	});
};

CkEditorLinkBrowser.loadData = function (url, onLoaded) {
	CkEditorLinkBrowser.folders = [];
	CkEditorLinkBrowser.links = {};

	$.getJSON(url, function (list) {
		$.each(list, function (_idx, item) {
			if (typeof(item.folder) === 'undefined') {
				item.folder = 'Images';
			}

			if (typeof(item.linkTitle) === 'undefined') {
				item.linkTitle = item.linkUrl;
			}

			CkEditorLinkBrowser.addLink(item.folder, item.linkUrl, item.linkTitle);
		});

		onLoaded();
	}).error(function(jqXHR, textStatus, errorThrown) {
		var errorMessage;
		if (jqXHR.status < 200 || jqXHR.status >= 400) {
			errorMessage = 'HTTP Status: ' + jqXHR.status + '/' + jqXHR.statusText + ': "<strong style="color: red;">' + url + '</strong>"';
		} else if (textStatus === 'parsererror') {
			errorMessage = textStatus + ': invalid JSON file: "<strong style="color: red;">' + url + '</strong>": ' + errorThrown.message;
		} else {
			errorMessage = textStatus + ' / ' + jqXHR.statusText + ' / ' + errorThrown.message;
		}
		CkEditorLinkBrowser.$linkContainer.html(errorMessage);
    });
};

CkEditorLinkBrowser.addLink = function (folderName, linkUrl, linkTitle) {
	if (typeof(CkEditorLinkBrowser.links[folderName]) === 'undefined') {
		CkEditorLinkBrowser.folders.push(folderName);
		CkEditorLinkBrowser.links[folderName] = [];
	}

	CkEditorLinkBrowser.links[folderName].push({
		"linkUrl": linkUrl,
		"linkTitle": linkTitle
	});
};

CkEditorLinkBrowser.initFolderSwitcher = function () {
	var $switcher = CkEditorLinkBrowser.$folderSwitcher;

	$switcher.find('li').remove();

	$.each(CkEditorLinkBrowser.folders, function (idx, folderName) {
		var $option = $('<li></li>').data('idx', idx).text(folderName);
		$option.appendTo($switcher);
	});


	if (CkEditorLinkBrowser.folders.length === 0) {
		$switcher.remove();
		CkEditorLinkBrowser.$linkContainer.text('No Pages.');
	} else {
		if (CkEditorLinkBrowser.folders.length === 1) {
			$switcher.hide();
		}

		$switcher.find('li:first').click();
	}
};

CkEditorLinkBrowser.renderLinksForFolder = function (folderName) {
	var links = CkEditorLinkBrowser.links[folderName],
		templateHtml = $('#js-template-link').html();

	CkEditorLinkBrowser.$linkContainer.html('');

	$.each(links, function (_idx, linkData) {
		var html = templateHtml;
		html = html.replace(new RegExp('%linkUrl%','g'), linkData.linkUrl);
		html = html.replace(new RegExp('%thumb%','g'), linkData.linkTitle);

		var $item = $($.parseHTML(html));

		CkEditorLinkBrowser.$linkContainer.append($item);
	});
};

CkEditorLinkBrowser.initEventHandlers = function () {
	$(document).on('click', '#js-folder-switcher li', function () {
		var idx = parseInt($(this).data('idx'), 10),
			folderName = CkEditorLinkBrowser.folders[idx];

		$(this).siblings('li').removeClass('active');
		$(this).addClass('active');

		CkEditorLinkBrowser.renderLinksForFolder(folderName);
	});

	$(document).on('click', '.js-page-link', function () {
		window.opener.CKEDITOR.tools.callFunction(CkEditorLinkBrowser.ckFunctionNum, $(this).data('url'));
		window.close();
	});
};

CkEditorLinkBrowser.getQueryStringParam = function (name) {
	var regex = new RegExp('[?&]' + name + '=([^&]*)'),
		result = window.location.search.match(regex);

	return (result && result.length > 1 ? decodeURIComponent(result[1]) : null);
};
