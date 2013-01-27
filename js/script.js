(function(d){d.each(["backgroundColor","borderBottomColor","borderLeftColor","borderRightColor","borderTopColor","color","outlineColor"],function(f,e){d.fx.step[e]=function(g){if(!g.colorInit){g.start=c(g.elem,e);g.end=b(g.end);g.colorInit=true}g.elem.style[e]="rgb("+[Math.max(Math.min(parseInt((g.pos*(g.end[0]-g.start[0]))+g.start[0]),255),0),Math.max(Math.min(parseInt((g.pos*(g.end[1]-g.start[1]))+g.start[1]),255),0),Math.max(Math.min(parseInt((g.pos*(g.end[2]-g.start[2]))+g.start[2]),255),0)].join(",")+")"}});function b(f){var e;if(f&&f.constructor==Array&&f.length==3){return f}if(e=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(f)){return[parseInt(e[1]),parseInt(e[2]),parseInt(e[3])]}if(e=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(f)){return[parseFloat(e[1])*2.55,parseFloat(e[2])*2.55,parseFloat(e[3])*2.55]}if(e=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(f)){return[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)]}if(e=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(f)){return[parseInt(e[1]+e[1],16),parseInt(e[2]+e[2],16),parseInt(e[3]+e[3],16)]}if(e=/rgba\(0, 0, 0, 0\)/.exec(f)){return a.transparent}return a[d.trim(f).toLowerCase()]}function c(g,e){var f;do{f=d.css(g,e);if(f!=""&&f!="transparent"||d.nodeName(g,"body")){break}e="backgroundColor"}while(g=g.parentNode);return b(f)}var a={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0],transparent:[255,255,255]}})(jQuery);

function ChangeBackgroundColor (color) {
  $('body').animate({
    backgroundColor: color
  });
}

String.prototype.trim = function () {
  return this.replace(/^ *(.*) *$/, '$1');
}

function showQuestion (n) {
  $('.q-current').animate({
    left: '-100%'
  }, function () {
    $(this).css('left', '100%').find('.answer').hide().animate({
      marginTop: '50px'
    }, 1);
  }).removeClass('q-current');
  $('#q-' + n.replace(/\./g, '-')).animate({
    left: 0
  }).addClass('q-current').find('.answer').each(function (i, el) {
    $(el).show().css('opacity', 0);
    setTimeout(function () {
      $(el).animate({
        opacity: 1,
        marginTop: '20px'
      });
    }, 500 * (i + 1));
  });
}

$(document).ready(function () {
  $('body').keydown(function (e) {
    e.preventDefault();
  });
	$.ajax('data/sample.yaml', {
		success: function (yamlData) {
      var jsonData = jsyaml.load(yamlData);
      var flattenedQA = {};
      var firstKey;

      for (var key in jsonData) if (jsonData.hasOwnProperty(key)) {
        if (!firstKey) {
          firstKey = key;
        }
        questionObj = jsonData[key];
        var answers;
        if (typeof questionObj !== 'object') {
          flattenedQA[key] = [questionObj];
          continue;
        }

        for (var question in questionObj) if (questionObj.hasOwnProperty(question)) {
          answers = questionObj[question];
          flattenedQA[key] = [question];
        }
        answers.forEach(function (answerObj) {
          for (var answer in answerObj) if (answerObj.hasOwnProperty(answer)) {
            if (!answerObj[answer]) continue;
            var nextQuestionNumberAndAction = String(answerObj[answer]).split(',');
            var nextQuestionNumber = nextQuestionNumberAndAction[0].trim();
            nextQuestionNumberAndAction.splice(0, 1).join(';');
            var nextAction = nextQuestionNumberAndAction;
            flattenedQA[key].push([answer, nextQuestionNumber, nextAction]);
            answerObj[answer] = jsonData[nextQuestionNumber];
          }
        });
      }

      console.log(jsonData);
      console.log(flattenedQA);

      for (key in flattenedQA) if (flattenedQA.hasOwnProperty(key)) {
        q = flattenedQA[key];

        var questionDOMString = '<p class="lead question" id="q-' + key.replace(/\./g, '-') + '">';
        questionDOMString += q[0];
        questionDOMString += '<br/>';

        if (q.length > 1) {
          questionDOMString += '<button class="btn btn-large btn-primary answer a-' + key +
            '" type="button" data-q="' + q[1][1] + '" data-action="' + escape(q[1][2]) + '">';
          questionDOMString += q[1][0];
          questionDOMString += '</button>';

          for (var i = 2, il = q.length; i < il; i++) {
            questionDOMString += '<button class="btn btn-large answer a-' + key +
              ' type="button" data-q="' + q[i][1] + '" data-action="' + escape(q[i][2]) + '">';
            questionDOMString += q[i][0];
            questionDOMString += '</button>';
          }
        }

        questionDOMString += '</p>';

        $('body').append(questionDOMString);
      }
      $('.answer').click(function () {
        showQuestion($(this).attr('data-q'));
        try {
          eval(unescape($(this).attr('data-action')));
        } catch (e) {
          console.log(e.message);
        }
      }).hide();
      showQuestion(firstKey);
		}
	});
}); 