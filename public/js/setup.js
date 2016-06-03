// bitdewy@gmail.com

'use strict';

(function () {
	$('img').click(function () {
		var file = $(this).attr('data');
		var width = $('.modal-lg').width() - 40;
		var height = width * 0.75;
		var myviewer = new marmoset.WebViewer(width, height, file);
		$('#source-modal .modal-body').empty();
		$('#source-modal .modal-body').append(myviewer.domRoot);
		$('#source-modal').modal();
		myviewer.loadScene();
	})

	$('a.btn.btn-success.btn-block').click(function () {
		var file = $(this).attr('data');
		var recv = function (a) {
			var archive = new marmoset.Archive(a);
			exporter.download(archive.files);
		};
		var c = function () {
			console.error('Package file (' + file + ') could not be retrieved.')
		};

		var d = function (loaded, total) {
			console.log('Package file progress: ' + loaded / total + '%');
		};
		marmoset.Network.fetchBinary(file, recv, c, d);
	})
})();
