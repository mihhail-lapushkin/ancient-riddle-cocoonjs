# Rich OOP features in 600 bytes of code!
##### Based on [Simple JavaScript Inheritance](http://ejohn.org/blog/simple-javascript-inheritance/) By John Resig

This plugin aims to give a simple, lightweight OOP bootstrap for JavaScript without the heavy stuff like automatic dependency resolution and other "full solutions for your enterprise". Tiny amount of plain cross-browser JS and a solid [Jasmine](http://pivotal.github.com/jasmine/) test suite is all there is!

## Defining classes
    Person = Base.extend({
      walking: false, // field
  
  	  init: function(name) { // constructor
  		this.name = name;
  	  }
  	
  	  walk: function() { // method
  		this.walking = true;
  	  }
    });
    
    var p = new Person("John Smith");
    p.walk();
    
    console.log(p.name); // "John Smith"
    console.log(p.walking); // true
    
## Static fields and methods
    CommunicationMethod = Base.extend({
      statics: {
      	VERBAL: 1,
      	NON_VERBAL: 2
      }
    });

    Language = CommunicationMethod.extend({
      statics: {
      	EN: "English",
      	EE: "Estonian",
      	getDefault: function() {
      		return Language.EN;
      	}
      }
      
      init: function(lang) {
      	this.lang = lang;
      }
    });
    
    console.log(CommunicationMethod.VERBAL); // 1
    console.log(Language.VERBAL); // 1
    console.log(Language.EE); // "Estonian"
    console.log(Language.getDefault()); // "English"
    
## Inheritance and parent constructors
    Person = Base.extend({
  	  walking: false,
  
  	  init: function(name) {
  		this.name = name;
  	  }
  	
  	  walk: function() {
  		this.walking = true;
  	  }
    });
    
    FlyingPerson = Person.extend({
  	  flying: false,
  
  	  init: function(name) {
  		this._super(name); // call parent constructor
  	  }
  	
  	  fly: function() {
  		this.flying = true;
  	  }
    });
    
    var p = new FlyingPerson("John Smith");
    p.walk();
    p.fly();
    
    console.log(p.name); // "John Smith"
    console.log(p.walking); // true
    console.log(p.flying); // true

## Calling overridden methods
    Worker = Base.extend({
  	  work: function() {
  		// do work
  	  }
    });
    
    LazyWorker = Worker.extend({
  	  work: function() {
  		if (Calendar.getDayOfWeek() == 'Monday') return;
  		
  		this._super(); // call parent method 'work'
  	  }
    });
    
## instanceof
    Child = Base.extend({});
    ChildOfChild = Child.extend({});
    
    console.log(new ChildOfChild() instanceof Child); // true
    console.log(new Child() instanceof Child); // true

See tests for more examples!
