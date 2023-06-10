//copy menu for mobile
function copyMenu() {
    var dptCategory = document.querySelector('.dpt-cat');
    var dptPlace = document.querySelector('.departments');
    dptPlace.innerHTML = dptCategory.innerHTML;

    //copy inside nav  to nav
    var mainNav = document.querySelector('.header-nav nav');
    var navPlace = document.querySelector('.off-canvas nav');
    navPlace.innerHTML = mainNav.innerHTML;

    //copy .header-top .wrapper to thetop-nav
    var topNav = document.querySelector('.header-top .wrapper');
    var topPlace = document.querySelector('.off-canvas .thetop-nav');
    topPlace.innerHTML = topNav.innerHTML;
}
copyMenu();


//show mobile menu
const menuButton = document.querySelector('.trigger'),
	closeButton = document.querySelector('.t-close'),
	addClass = document.querySelector('.site');
menuButton.addEventListener('click', function() {
	addClass.classList.toggle('showmenu')
})
closeButton.addEventListener('click', function() {
	addClass.classList.remove('showmenu')
})

const dptButton = document.querySelector('.dpt-cat .dpt-trigger'),
    dptClass = document.querySelector('.site');
dptButton.addEventListener('click', function () {
    dptClass.classList.toggle('showdpt')
})


//show submenu on mobile
const submenu = document.querySelectorAll('.has-child .icon-small');
submenu.forEach((menu) => menu.addEventListener('click', toggle));

function toggle(e) {
	e.preventDefault();
	submenu.forEach((item) => item != this ? item.closest('.has-child').classList.remove('expand') : null);
	if (this.closest('.has-child').classList != 'expand');
	this.closest('.has-child').classList.toggle('expand')
}

//show search mobile
const searchButton = document.querySelector('.t-search'),
	searchClose = document.querySelector('.search-close'),
	showClass = document.querySelector('.site');
searchButton.addEventListener('click', function() {
	showClass.classList.toggle('showsearch')
})
searchClose.addEventListener('click', function() {
	showClass.classList.remove('showsearch')
})

//slider
const swiper = new Swiper('.swiper', {
	// Optional parameters
	// slidesPerView: 1,
	// spaceBetween: 10,
	loop: true,

	// If we need pagination
	pagination: {
		el: '.swiper-pagination',
	},

	// Navigation arrows
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},

	autoplay: {
		delay: 2000,
	},

	// And if we need scrollbar
	scrollbar: {
		el: '.swiper-scrollbar',
	},
});

//product image slider
var productThumb = new Swiper('.small-image', {
	loop: true,
	spaceBetween: 10,
	slidesPerView: 4,
	freeMode: true,
	freeMode: {
		enabled: true,
		sticky: true,
	},
	watchSlidesProgress: true,
	breakpoint: {
		481: {
			spaceBetween: 32,
		}
	}
});
var productBig = new Swiper('.big-image', {
	loop: true,
	autoHeight: true,
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	thumbs: {
		swiper: productThumb
	}
});

$(document).ready(function() {
	$(window).scroll(function() {
		if ($(this).scrollTop() > 300) {
			$('.back-top').fadeIn();
		} else {
			$('.back-top').fadeOut();
		}
	});

	// scroll body to 0px on click
	$('.back-top').click(function() {
		$('body,html').animate({
			scrollTop: 0
		}, 500);
		return false;
	});
})

// slider products 
$(document).ready(function() {

	$('#itemslider').carousel({ interval: 2000 });

	$('.carousel-showmanymoveone .item').each(function() {
		var itemToClone = $(this);

		for (var i = 1; i < 6; i++) {
			itemToClone = itemToClone.next();

			if (!itemToClone.length) {
				itemToClone = $(this).siblings(':first');
			}

			itemToClone.children(':first-child').clone()
				.addClass("cloneditem-" + (i))
				.appendTo($(this));
		}
	});
});

$(document).ready(function() {
	var autoplaySlider = $('#selling-products').lightSlider({
		autoWidth: true,
		auto: true,
		speed: 1000,
		loop: true,
		pauseOnHover: true,
		onBeforeSlide: function(el) {
			$('#current').text(el.getCurrentSlideCount());
		},
		responsive: [
			{
				breakpoint: 800,
				settings: {
					item: 3,
					slideMove: 1,
					slideMargin: 6,
				}
			},
			{
				breakpoint: 480,
				settings: {
					item: 2,
					slideMove: 1
				}
			}
		]
	});
	$('#total').text(autoplaySlider.getTotalSlideCount());
});

$(document).ready(function() {
	$('#newProducts').lightSlider({
		autoWidth: true,
		loop: true,
		onSliderLoad: function() {
			$('#newProducts').removeClass('cS-hidden');
		}
	});
});

$(document).ready(function() {
	$('#related-products').lightSlider({
		autoWidth: true,
		auto: true,
		speed: 1500,
		loop: true,
		pauseOnHover: true,
		onSliderLoad: function() {
			$('#related-products').removeClass('cS-hidden');
		}
	});
});

$(document).ready(function() {
	$('#brands').lightSlider({
		autoWidth: true,
		loop: true,
		auto: true,
		speed: 2000,
		pauseOnHover: true,
		responsive: [
			{
				breakpoint: 800,
				settings: {
					item: 3,
					slideMove: 1,
					slideMargin: 6,
				}
			},
			{
				breakpoint: 480,
				settings: {
					item: 2,
					slideMove: 1
				}
			}
		]
	});
});

//show cart on click
// const divtoShow = '.mini-cart';
// const divPopup = document.querySelector(divtoShow);
// const divtrigger = document.querySelector('.cart-trigger');

// divtrigger.addEventListener('click', () => {
//     setTimeout(() => {
//         if (!divPopup.classList.contains('show')) {
//             divPopup.classList.add('show');
//         }
//     }, 250)
// })
// //close by click outside
// document.addEventListener('click', (e) => {
//     const isClosest = e.target.closest(divtoShow);
//     if (!isClosest && divPopup.classList.contains('show')) {
//         divPopup.classList.remove('show')
//     }
// })


// show dropdown
function dropdown_account() {
	document.getElementById("accountDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
	if (!event.target.matches('.dropbtn-account')) {
		var dropdowns = document.getElementsByClassName("account_dropdown-content");
		var i;
		for (i = 0; i < dropdowns.length; i++) {
			var openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	}
}

function showHideCancelOrder(elm) {
	if (elm == "other-reason") {
		//display textbox
		document.getElementById('content-reason').style.display = "block";
	} else {
		//hide textbox
		document.getElementById('content-reason').style.display = "none";
	}
}

function updateTextInputRange(val) {
	document.getElementById('textInputRange').innerHTML = val;
}


$(document).ready(function() {
	var loader = document.getElementById("preloader");
	window.addEventListener("load", () => {
		loader.style.display = "none";
	});
	loadCount();
});

var validateSearchForm = (form) => {
	let minPrice = form.minPrice.value.replaceAll(',', '');
	let maxPrice = form.maxPrice.value.replaceAll(',', '');

	// check isNaN
	if (isNaN(minPrice) === true) {
		showWarningToast('Giá "TỪ" không hợp lệ');
		return false;
	}
	if (isNaN(maxPrice) === true) {
		showWarningToast('Giá "ĐẾN" không hợp lệ');
		return false;
	}

	// check min < max
	if (minPrice && maxPrice && (Number(minPrice) > Number(maxPrice))) {
		showWarningToast('Giá "TỪ" phải nhỏ hơn giá "ĐẾN"');
		return false;
	}

	// process request params: min max
	else {
		if (Number(minPrice) > 0) {
			form.minPrice.value = minPrice;
		}
		if (Number(maxPrice) > 0) {
			form.maxPrice.value = maxPrice;
		}
		form.submit();
		return true;
	}

	return false;
};


function showHideAddress(elm) {
	if (elm == "other-address") {
		//display textbox
		document.getElementById('content-other-address').style.display = "block";
	} else {
		//hide textbox
		document.getElementById('content-other-address').style.display = "none";
	}
}


const addToFavorite = (id) => {
	if ($("#remoteEmail").text()) {
		let Parameter = {
			url: `http://localhost:8080/rest/favorites/pid/${id}`,
			method: "GET",
			responseType: "",
		};
		let promise = axios(Parameter);
		promise.then(function(result) {
			let response = result.data;
			if (response === true) {
				loadCount();
				showSuccessToast('Thêm vào yêu thích thành công!');
				let linkLike = $(".product_liked-" + id);
				linkLike.addClass('heart-account');
				linkLike.attr('onclick', 'removeFromFavorite(' + id + ')');
			} else if (response === false) {
				showWarningToast('Đã tồn tại sản phẩm này trong danh sách yêu thích!');
			} else {
				showErrorToast("Lỗi hệ thống 1!");
				console.log(error);
			}
		}).catch(error => {
			showErrorToast("Lỗi hệ thống 2!");
			console.log(error);
		});
	} else {
		location.href = "/login";
	}
};

const removeFromFavorite = (id) => {
	let Parameter = {
		url: `http://localhost:8080/rest/favorites/pid/${id}`,
		method: "DELETE",
		responseType: "",
	};
	let promise = axios(Parameter);
	promise.then(function(result) {
		if (result.data === true) {
			loadCount();
			showSuccessToast('Bỏ yêu thích thành công!');
			let linkLike = $(".product_liked-" + id);
			linkLike.removeClass('heart-account');
			linkLike.attr('onclick', 'addToFavorite(' + id + ')');
		} else {
			showErrorToast("Lỗi hệ thống 1!");
			console.log(error);
		}
	}).catch(error => {
		showErrorToast("Lỗi hệ thống 2!");
		console.log(error);
	});
};

const loadCount = () => {
	var email = null;
	email = $('#remoteEmail').text();
	if (email != '') {
		let Parameter = {
			url: `/rest/accounts/email/${email}`,
			method: "GET",
			responseType: "",
		}
		let promise = axios(Parameter);
		promise.then(function(result) {
			let id = result.data;
			let Parameter = {
				url: `/rest/favorites/${id}`,
				method: "GET",
				responseType: "",
			};
			let promise = axios(Parameter);
			promise.then(function(result) {
				$(".product_liked-" + id);
				document.getElementById('count-fav').innerHTML = result.data.length;
			}).catch(error => {
				showErrorToast("Lỗi hệ thống 1!");
				console.log(error);
			});
		}).catch(error => {
			showErrorToast("Lỗi hệ thống 2!");
			console.log(error);
		});
	}else{
		return false;
	}
}