CKEDITOR.plugins.add('linkbrowser', {
	"init": function (editor) {
		if (typeof(editor.config.linkbrowser_listUrl) === 'undefined' || editor.config.linkbrowser_listUrl === null) {
			return;
		}

		var url = editor.plugins.linkbrowser.path + "browser/browser.html?listUrl=" + encodeURIComponent(editor.config.linkbrowser_listUrl);
		if (editor.config.baseHref) {
			url += "&baseHref=" + encodeURIComponent(editor.config.baseHref);
		}

		editor.config.filebrowserLinkBrowseUrl = url;
	}
});
