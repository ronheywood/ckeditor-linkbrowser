CKEditor Link Browser plugin
=============================

**linkbrowser** is a `CKEditor <http://ckeditor.com/>`_ plugin that allows images on the server to be browsed and picked for inclusion into the editor's contents.

This plugin is based on the `ckimagebrowser <https://github.com/spantaleev/ckeditor-imagebrowser>`_ plugin 

This plugin integrates with the **link** plugin (part of CKEditor),
by making it provide a **Browse Server** button in the link dialog window.

- you only need to provide a list of URLs in a JSON format, and the link browser will take care of the rest.

In fact, it uses the same data format as Redactor, allowing for an easy transition between the two editors.

Installation
------------

Copy the whole contents of this repository into a new ``plugins/linkbrowser`` directory in your CKEditor install.

Make sure you're using the **Standard** or **Full** `CKEditor packages <http://ckeditor.com/download>`_.
The **Basic** package lacks an in-built "File Browser" plugin, which this plugin depends on.
You can also use a `Custom CKEditor package <http://ckeditor.com/builder>`_, if you build it with "File Browser" plugin support.

Usage
-----

Enable the plugin by adding it to `extraPlugins` and specify the `linkBrowser_listUrl` parameter::

	CKEDITOR.replace('textareaId', {
		"extraPlugins": "linkbrowser",
		"imageBrowser_listUrl": "/path/to/url_list.json"
	});

The **linkBrowser_listUrl** configuration parameter points to a URL that lists the server's images in a JSON format.

Example::

[
	{
		"linkUrl": "https://www.example.com",
		"folder": "Home",
		"linkTitle": "Website Home Page"
	},
	{
		"linkUrl": "https://www.example.com/about-us",
		"linkTitle": "About Us Page",
		"folder": "About Us"
	},
	{
		"linkUrl": "https://www.example.com/about-us/people",
		"linkTitle": "About Us | People",
		"folder": "About Us"
	}
]

The above says that there are 2 page directories ("Home" and "About Us") with pages in each of them.

The **linkUrl** field is the relative/absolute url being used when the link gets put into the editor's contents.

The **linkTitle** field is *optional*. It specifies the title attribute to be used on the link tag.

The **folder** field is *optional*. If omitted, the url list will not be split into folders.
