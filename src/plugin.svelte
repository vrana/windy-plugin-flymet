<ul style="padding-left: 20px;">
<li><a data-flymet="">Flymet: nic</a></li>
<li><a data-flymet="cudf" style="font-weight: bold;">Deficit konvektivní teploty</a> <a href="https://flymet.meteopress.cz/manual.php#popis21" target="_blank"><sup>?</sup></a></li>
<li><a data-flymet="cukh">Kupovitá oblačnost</a> <a href="https://flymet.meteopress.cz/manual.php#popis22" target="_blank"><sup>?</sup></a></li>
<li><a data-flymet="cuvr">Rychlost stoupání</a> <a href="https://flymet.meteopress.cz/manual.php#popis2" target="_blank"><sup>?</sup></a></li>
<li><a data-flymet="curya">Stoupání 1000 m</a> <a href="https://flymet.meteopress.cz/manual.php#popis27" target="_blank"><sup>?</sup></a></li>
<li><a data-flymet="curyb">Stoupání 1500 m</a> <a href="https://flymet.meteopress.cz/manual.php#popis27" target="_blank"><sup>?</sup></a></li>
<li><a data-flymet="drtr">Druh termiky</a></li>
</ul>
<p>Neprůhlednost: <input id="flymet-opacity" type="range" min="0" max="100" value="50" style="vertical-align: text-bottom;"></p>
<p>Zdroj dat: <a href="https://flymet.meteopress.cz/cr/" target="_blank">Flymet</a></p>
<script>
import broadcast from '@windy/broadcast';
import {map} from '@windy/map';
import store from '@windy/store';
import rootScope from '@windy/rootScope';
import {onMount, onDestroy} from 'svelte';

/** @type {L.ImageOverlay} */
let flymet;
/** @type {L.ImageOverlay} */
let flymetSk;
/** @type {string} */
let flymetType = 'cudf';

export const onopen = () => {
	if (!flymet) {
		const openInApp = document.getElementById('open-in-app');
		if (openInApp) {
			openInApp.style.display = 'none';
		}
		flymet = L.imageOverlay('https://flymet.meteopress.cz/cr/cudf13.png', [[48, 11.65], [51.65, 19.35]], {opacity: .5});
		flymetSk = L.imageOverlay('https://flymet.meteopress.cz/sk/cudf13.png', [[47.1, 16.5], [50.145, 22.9]], {opacity: .5});
		updateFlymet();
		store.on('timestamp', updateFlymet);
	}
};

function updateFlymet() {
	const timestamp = new Date(store.get('timestamp'));
	const now = new Date();
	const hour = timestamp.getUTCHours();
	let url = '';
	let urlSk = '';
	if (flymetType) {
		const flymetTypeSk = flymetType.replace(/^cury/, 'ecury');
		if (isSameDay(timestamp, now) && hour > 0) { // Today.
			url = 'https://flymet.meteopress.cz/cr/' + flymetType + hour + '.png';
			if (flymetTypeSk != 'cuvr' && flymetTypeSk != 'drtr') {
				urlSk = 'https://flymet.meteopress.cz/sk/' + flymetTypeSk + hour + '.png';
			}
		} else if (isSameDay(timestamp, addDay(now))) { // Tomorrow.
			url = 'https://flymet.meteopress.cz/cr' + (hour ? 'dl/' + flymetType + hour : '/' + flymetType + '24') + '.png';
			if (flymetTypeSk != flymetType) {
				urlSk = 'https://flymet.meteopress.cz/sk' + (hour ? 'dl/' + flymetTypeSk + hour : '/' + flymetTypeSk + '24') + '.png';
			}
		} else if (isSameDay(timestamp, addDay(now)) && hour < 20) { // Day after tomorrow.
			url = 'https://flymet.meteopress.cz/crdl' + (hour ? '1/' + flymetType + hour : '/' + flymetType + '24') + '.png';
		}
	}
	if (url) {
		flymet.setUrl(urlSk ? 'https://pg.vrana.cz/flymet/cz.php?url=' + url : url).addTo(map);
	} else {
		flymet.remove();
	}
	if (urlSk) {
		flymetSk.setUrl('https://pg.vrana.cz/flymet/sk.php?url=' + urlSk).addTo(map);
	} else {
		flymetSk.remove();
	}
}

onMount(() => {
	Array.from(document.querySelectorAll('[data-flymet]')).forEach((el) => el.onclick = (event) => {
		document.querySelector('[data-flymet="' + flymetType + '"]').style.fontWeight = 'normal';
		event.target.style.fontWeight = 'bold';
		flymetType = event.target.dataset['flymet'];
		updateFlymet();
		if (rootScope.isMobile) {
			broadcast.fire('rqstClose', 'windy-plugin-flymet');
		}
	});

	document.querySelector('#flymet-opacity').oninput = function(e) {
		flymet.setOpacity(e.target.value / 100);
		flymetSk.setOpacity(e.target.value / 100);
	};
});

onDestroy(() => {
	flymetType = '';
	updateFlymet();
});

/** Adds one day to date.
 * @param {Date} date
 * @return {Date} The modified date.
 */
function addDay(date) {
	date.setDate(date.getDate() + 1);
	return date;
}

/** Checks if day is the same.
 * @param {Date} a
 * @param {Date} b
 * @return {boolean}
 */
function isSameDay(a, b) {
	return a.getDate() == b.getDate();
}
</script>
