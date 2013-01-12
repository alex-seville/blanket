//this test should fail
var sampleTest = function(x){
	return x === 10 ? "ten" : "not ten";
};

var sampleTest2 = function(x){
    return x === 5 ? "five" : "not five";
};

var sampleTest3 = function(x){
    return x > 5 ? x < 10 ? "5-10" : "greater than ten" : "less than five";
};

var sampleTest4 = function(x){
    return x === 5 ? "five" : "not five";
};