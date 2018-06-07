var getCuota = function (MONTO, MESES, RIESGO, TASA, COMISION){

	// INICIALES
	var COMI = {
		12: [0.100, 0.09, 0.08],
		18: [0.140, 0.12, 0.10],
		24: [0.175, 0.15, 0.13]
	};
	var C = COMI[MESES];

  //Bajo, bajo-medio, moderado, medio
      3 ,  2,    1,  0

	//VALORES
	var TASA = TASA || ([0.0200,0.0175,0.0159,0.0142])[RIESGO];
	var COMISION = COMISION || MONTO*((MONTO<50000)?(MONTO<40000)?C[0]:C[1]:C[2]);

	// CALCULOS
	var PRESTAMO = MONTO + COMISION;
	var AMORTIZ = COMISION / ((Math.pow((1+TASA),(MESES))-1)/((1+TASA)-1));
	var MENSUAL = (PRESTAMO * TASA) + AMORTIZ;
	var TCEA = Math.pow(((MENSUAL/MONTO)+1),12) - 1;

	/*
	for(var i=0;i<MESES;i++){
		console.log(PRESTAMO.toFixed(2), (MENSUAL - AMORTIZ).toFixed(2) , AMORTIZ.toFixed(2), MENSUAL.toFixed(2));
		PRESTAMO -= AMORTIZ;
		AMORTIZ = AMORTIZ*(1+TASA);
	}
	*/

	return {cuota: MENSUAL, tcea: TCEA*100};
}


var somechange = function(){
		var monto = +$('.postula input[name="monto"]').data('val');
		var meses = +$('.postula select[name="tiempo_prestamo"]').val();
		var riesgo = +$('.postula select[name="riesgo"]').val();
		var cuota = getCuota(monto, meses, riesgo);
    var tcea = cuota.tcea;
    cuota = (cuota.cuota.toFixed(2)+"").split('.');

    $('.theresult h2').html('<span>S/</span>'+cuota[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")+'<span>.'+cuota[1]+"</span>");
    $('.discla span').text((+tcea).toFixed(2));

    $('.actualcrono table').html(function(){
        var ans = "";

        for( var i = 0 ; i < meses ; i++ ){
            ans += "<tr>";
            ans +=    "<td class='mes'>";
            ans +=      "Mes "+(i+1);
            ans +=    "</td>";
            ans +=    "<td>";
            ans +=      "<small>S/</small> ";
            if( i == meses - 1 ){
								ans += (+cuota[0] + monto+ "").replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '.' + cuota[1];
            } else {
								ans += cuota[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") +'.'+ cuota[1];
            }
            ans +=    "</td>";
            ans += "</tr>"
        }

        return ans;
    });

};

function isfail(){
    var newval = $('input[name="monto"]').data('val');
    if( newval < 20000 ){
        $('input[name="monto"]').data('val', 20000);
    } else if( newval > 10000000 ) {
        $('input[name="monto"]').data('val', 10000000);
    }
}

function format(){
    isfail();
    $('input[name="monto"]').val("S/ "+($('input[name="monto"]').data('val')+"").replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
    somechange();
};

$('select[name="tiempo_prestamo"]').change(function(){
    somechange();
});

$('input[name="monto"]').on('input',function(){
    var newval = $(this).val().replace(/[^0-9]/g, '');
    $(this).val(newval).data('val', newval);
});

$('input[name="monto"]').focus(function(){
    $(this).val($(this).data('val'));
});

$('input[name="monto"]').blur(format);

$('.jumbos').click(function(){
		var amount = (+$(this).data('val'))*10000;
		var monto =  $('input[name="monto"]');
		monto.data('val', Math.min(10000000,Math.max(20000,+monto.data('val')+amount)));
		if (monto.data('val')<= 20000) {
				monto.siblings().last().addClass("disabled");
		} else {
				monto.siblings().last().removeClass("disabled");
		}
    format();
});

$(".eriesgo option").each(function () {
    $(this).attr("data-label", $(this).text());
    $(this).text($(this).data('replace'));
});

$(".eriesgo").on("focus", function () {
    $(this).find("option").each(function () {
        $(this).text($(this).data("replace")+" ("+$(this).attr("data-label")+")");
    });
}).on("change mouseleave", function (e) {
    if(e.relatedTarget == null) return;
    $(this).focus();
    $(this).find("option:selected").text(function(){
        return $(this).data('replace');
    });
    $(this).blur();
    somechange();
}).change();

