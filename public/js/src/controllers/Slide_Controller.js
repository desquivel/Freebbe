$.sammy('body', function(){ 
	
	this.bind('Slide_Delete', function(e,data) {
			var context = this;
			var id = data['id'];
			$.ajax({
				url: "/slide/" + id,
				type:"get",
				context: document.body,
				success: function(data){
					context.trigger('Slide_Delete_handleSuccess',{all: data,id: id});
				},
				error: function(re,text,error) {
					context.trigger('Slide_Delete_handleError',{request: re , text: text , error: error});
				}
			});
	});
	
	this.bind('Slide_Delete_handleSuccess', function(e,data) {
		var id = data['id'];
		var slide = Slide.select(function() {
		  return this.attr("_id").$oid == id
		}).first()
		 
		Slide.remove(slide);
		Slide.trigger("refreshSlides")
	});
	
	this.bind('Slide_Delete_handleError', function(e,data) {
		alert(app.json(data));
	});
	
	this.bind('Slide_Get', function(e,data) {
		var context = this;
		$.ajax({
			url: "/slides",
			type:"get",
			data: "parentId=" + currentSlideId,
			context: document.body,
			success: function(data){
				context.trigger('Slide_Get_handleSuccess',{all: data});
			},
			error: function(re,text,error) {
				context.trigger('Slide_Get_handleError',{request: re , text: text , error: error});
			}
		});
	});
	
	this.bind('Slide_Get_handleSuccess', function(e,data) {
		Slide.select(function() {
		  return true
		}).each(function() {Slide.remove(this);});
		
		var slides = this.json(data['all']);
			var i = slides.length-1;
	
		while(i>-1){
			var p = slides[i];
			var slide = createSlideFromJSON(p);
			slide.save();
			i -=1;
		}
		Slide.trigger("refreshSlides")
	});
	
	function createSlideFromJSON(p){
			var slide = new Slide(p);
			var lineas = slide.attr('lines');
			var newVal='';
			for(ii in lineas){
				newVal += '<li>' + lineas[ii] + '</li>';
			}

			slide.attr('lines', newVal);
			return slide;
	}
	
	this.bind('Slide_Get_handleError', function(e,data) {
		alert(app.json(data));
	});
	
	this.bind('Slide_Create', function(e,data) {
		var context = this;
		var j = app.json(data);
		$.ajax({
			url: "/slide",
			data: "data=" + j,
			type:"post",
			context: document.body,
			success: function(data){
				context.trigger('Slide_Create_handleSuccess',{all: data});
			},
			error: function(re,text,error) {
				context.trigger('Slide_Create_handleError',{request: re , text: text , error: error});
			}
		});
	});	
	
	this.bind('Slide_Create_handleSuccess', function(e,data) {
		var context = this;
		var p = this.json(data['all']);
		var slide = createSlideFromJSON(p);
		slide.save();
		Slide.trigger("refreshSlides")
	});
	
	this.bind('Slide_Create_handleError', function(e,data) {
		var context = this;
		alert(context.json(data));
	});
	
});