const temp = document.getElementById("temp"),
    date = document.getElementById("date-time"),
    condition = document.getElementById("condition"),
    rain = document.getElementById("rain"),
    mainIcon = document.getElementById("icon"),
    currentLocation = document.getElementById("location"),
    uvIndex = document.querySelector(".uv-index"),
    uvText = document.querySelector(".uv-text"),
    windSpeed = document.querySelector(".wind-speed"),
    sunRise = document.querySelector(".sun-rise"),
    sunSet = document.querySelector(".sun-set"),
    humidity = document.querySelector(".humidity"),
    visibilty = document.querySelector(".visibilty"),
    humidityStatus = document.querySelector(".humidity-status"),
    airQuality = document.querySelector(".air-quality"),
    airQualityStatus = document.querySelector(".air-quality-status"),
    visibilityStatus = document.querySelector(".visibilty-status"),
    searchForm = document.querySelector("#search"),
    search = document.querySelector("#query"),
    celciusBtn = document.querySelector(".celcius"),
    fahrenheitBtn = document.querySelector(".fahrenheit"),
    tempUnit = document.querySelectorAll(".temp-unit"),
    hourlyBtn = document.querySelector(".hourly"),
    weekBtn = document.querySelector(".week"),
    weatherCards = document.querySelector("#weather-cards");

let currentCity = "";
let currentUnit = "c";
let hourlyorWeek = "week";

// function to get date and time
function getDateTime() {
    let now = new Date(),
        hour = now.getHours(),
        minute = now.getMinutes();

    let days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    // 12 hours format
    hour = hour % 12;
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    let dayString = days[now.getDay()];
    return `${dayString}, ${hour}:${minute}`;
}

//Updating date and time
date.innerText = getDateTime();
setInterval(() => {
    date.innerText = getDateTime();
}, 1000);

// function to get public ip address
function getPublicIp() {
    fetch("https://geolocation-db.com/json/", {
        method: "GET",
        headers: {},
    })
        .then((response) => response.json())
        .then((data) => {
            currentCity = data.city;
            getWeatherData(data.city, currentUnit, hourlyorWeek);
        })
        .catch((err) => {
            console.error(err);
        });
}

getPublicIp();

// function to get weather data
function getWeatherData(city, unit, hourlyorWeek) {
    fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=T5VY9TGHR67HGL7VFC7656X6L&contentType=json`, {
        method: "GET",
        headers: {},
    }
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error("Kesalahan saat memuat data cuaca");
            }
            return response.json();
        })
        .then((data) => {
            let today = data.currentConditions;
            if (unit === "c") {
                temp.innerText = today.temp;
            } else {
                temp.innerText = celciusToFahrenheit(today.temp);
            }
            currentLocation.innerText = data.resolvedAddress;
            condition.innerText = today.conditions;
            rain.innerText = "Perc - " + today.precip + "%";
            uvIndex.innerText = today.uvindex;
            windSpeed.innerText = today.windspeed;
            measureUvIndex(today.uvindex);
            mainIcon.src = getIcon(today.icon);
            changeBackground(today.icon);
            humidity.innerText = today.humidity + "%";
            updateHumidityStatus(today.humidity);
            visibilty.innerText = today.visibility;
            updateVisibiltyStatus(today.visibility);
            airQuality.innerText = today.winddir;
            updateAirQualityStatus(today.winddir);
            if (hourlyorWeek === "hourly") {
                updateForecast(data.days[0].hours, unit, "day");
            } else {
                updateForecast(data.days, unit, "week");
            }
            sunRise.innerText = covertTimeTo12HourFormat(today.sunrise);
            sunSet.innerText = covertTimeTo12HourFormat(today.sunset);
        })
        .catch((err) => {
            // Menggunakan SweetAlert untuk menampilkan pesan error
            Swal.fire({
                icon: 'error',
                title: 'Kesalahan',
                text: err.message,
            });
        });
}

const options = {
    // Required: API key
    key: 'ObOiatNhupB83HJIs8atG5pz9DiiKUnz',

    // Put additional console output
    verbose: true,

    // Optional: Initial state of the map
    lat: -0.2159,
    lon: 1006334.,
    zoom: 5,
};

// let map; // Variabel untuk menyimpan instance peta
// let windyContainer; // Variabel untuk menyimpan elemen container Windy
// let mapCard; // Variabel untuk menyimpan elemen card map
// let isWindyVisible = true; // Status tampilan container Windy

// // Initialize Windy API
// function initializeWindy() {
//     windyInit(options, windyAPI => {
//         const { picker, utils, broadcast, store } = windyAPI;

//         picker.on('pickerOpened', ({ lat, lon, values, overlay }) => {
//             // -> 48.4, 14.3, [ U,V, ], 'wind'
//             console.log('opened', lat, lon, values, overlay);

//             const windObject = utils.wind2obj(values);
//             console.log(windObject);
//         });

//         picker.on('pickerMoved', ({ lat, lon, values, overlay }) => {
//             // picker was dragged by user to latLon coords
//             console.log('moved', lat, lon, values, overlay);
//         });

//         picker.on('pickerClosed', () => {
//             // picker was closed
//         });

//         store.on('pickerLocation', ({ lat, lon }) => {
//             console.log(lat, lon);

//             const { values, overlay } = picker.getParams();
//             console.log('location changed', lat, lon, values, overlay);
//         });

//         // Wait since weather is rendered
//         broadcast.once('redrawFinished', () => {
//             // Opening of a picker (async)
//             picker.open({ lat: -0.2159, lon: 100.6334 });
//         });

//         map = windyAPI.map;
//         // .map is an instance of Leaflet map

//         // Tambahkan pengecekan saat peta diinisialisasi
//         if (!isWindyVisible) {
//             map.remove(); // Hilangkan peta jika container Windy tidak terlihat
//             hideMapCard(); // Sembunyikan card map saat peta dihilangkan
//         }

//         // Memperbarui picker saat waktu berubah
//         setInterval(() => {
//             const timestamp = store.get('timestamp');
//             if (timestamp) {
//                 picker.setTime(timestamp);
//             }
//         }, 1000); // Ubah interval sesuai dengan kebutuhan Anda
//     });
// }

// // Panggil fungsi inisialisasi Windy saat halaman dimuat
// initializeWindy();


// Tambahkan event listener untuk tombol Harian dan Mingguan
const hourlyButton = document.querySelector('.hourly');
const weeklyButton = document.querySelector('.week');

hourlyButton.addEventListener('click', () => {
    if (map) {
        map.remove(); // Hilangkan peta saat tombol Harian diklik
        map = null; // Setel variabel peta menjadi null
        hideWindyContainer(); // Sembunyikan container Windy saat tombol Harian diklik
        hideMapCard(); // Sembunyikan card map saat tombol Harian diklik
    }
});

weeklyButton.addEventListener('click', () => {
    if (!map) {
        if (!isWindyVisible) {
            showWindyContainer(); // Tampilkan kembali container Windy jika sebelumnya disembunyikan
        }
        initializeWindy(); // Inisialisasi ulang Windy saat tombol Mingguan diklik
        showMapCard(); // Tampilkan kembali card map saat tombol Mingguan diklik
    }
});

// Fungsi untuk menyembunyikan container Windy
function hideWindyContainer() {
    isWindyVisible = false; // Setel status tampilan container Windy menjadi false

    if (windyContainer) {
        windyContainer.style.display = 'none';
    }
}

// Fungsi untuk menampilkan kembali container Windy
function showWindyContainer() {
    isWindyVisible = true; // Setel status tampilan container Windy menjadi true

    if (windyContainer) {
        windyContainer.style.display = 'block';
    }
}

// Fungsi untuk menyembunyikan card map
function hideMapCard() {
    if (mapCard) {
        mapCard.style.display = 'none';
    }
}

// Fungsi untuk menampilkan kembali card map
function showMapCard() {
    if (mapCard) {
        mapCard.style.display = 'block';
    }
}

// Jalankan fungsi untuk mendapatkan elemen container Windy dan card map saat halaman dimuat
window.addEventListener('DOMContentLoaded', () => {
    windyContainer = document.getElementById('windy');
    mapCard = document.querySelector('.map-card');
});

// Fungsi untuk mengubah posisi map-card
function updateMapCardPosition() {
    const sidebar = document.querySelector('.l-sidebar');
    const mapCard = document.querySelector('.map-card');

    if (sidebar && mapCard) {
        const sidebarWidth = sidebar.offsetWidth;
        const sidebarMargin = parseInt(window.getComputedStyle(sidebar).paddingLeft, 0);
        const isSidebarExpanded = sidebar.classList.contains('show');
        const mapCardLeft = isSidebarExpanded ? sidebarWidth + sidebarMargin + 10 : 10; // Sesuaikan jarak antara sidebar dan map card di sini

        mapCard.style.left = mapCardLeft + 'px';
    }
}

// Jalankan fungsi untuk mengatur posisi awal map-card saat halaman dimuat
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(updateMapCardPosition, 0); // Tambahkan timeout agar fungsi dijalankan setelah rendering sidebar
});

// Tambahkan event listener untuk perubahan ukuran window
window.addEventListener('resize', () => {
    updateMapCardPosition();
});

// Tambahkan event listener saat sidebar diklik
const toggleSidebar = document.getElementById('header-toggle');
toggleSidebar.addEventListener('click', () => {
    setTimeout(updateMapCardPosition, 0); // Tambahkan timeout agar fungsi dijalankan setelah transisi selesai
});


//function to update Forecast
function updateForecast(data, unit, type) {
    weatherCards.innerHTML = "";
    let day = 0;
    let numCards = 0;
    if (type === "day") {
        numCards = 24;
    } else {
        numCards = 7;
    }
    for (let i = 0; i < numCards; i++) {
        let card = document.createElement("div");
        card.classList.add("card");
        let dayName = getHour(data[day].datetime);
        if (type === "week") {
            dayName = getDayName(data[day].datetime);
        }
        let dayTemp = data[day].temp;
        if (unit === "f") {
            dayTemp = celciusToFahrenheit(data[day].temp);
        }
        let iconCondition = data[day].icon;
        let iconSrc = getIcon(iconCondition);
        let tempUnit = "°C";
        if (unit === "f") {
            tempUnit = "°F";
        }
        card.innerHTML = `
                <h2 class="day-name">${dayName}</h2>
            <div class="card-icon">
              <img src="${iconSrc}" class="day-icon" alt="" />
            </div>
            <div class="day-temp">
              <h2 class="temp">${dayTemp}</h2>
              <span class="temp-unit">${tempUnit}</span>
            </div>
  `;
        weatherCards.appendChild(card);
        day++;
    }
}

// function to change weather icons
function getIcon(condition) {
    if (condition === "partly-cloudy-day") {
        return "https://i.ibb.co/PZQXH8V/27.png";
    } else if (condition === "partly-cloudy-night") {
        return "https://i.ibb.co/Kzkk59k/15.png";
    } else if (condition === "rain") {
        return "https://i.ibb.co/kBd2NTS/39.png";
    } else if (condition === "clear-day") {
        return "https://i.ibb.co/rb4rrJL/26.png";
    } else if (condition === "clear-night") {
        return "https://i.ibb.co/1nxNGHL/10.png";
    } else {
        return "https://i.ibb.co/rb4rrJL/26.png";
    }
}

// function to change background depending on weather conditions
function changeBackground(condition) {
    const body = document.querySelector(".back-bg");
    let bg = "";
    if (condition === "partly-cloudy-day") {
        bg = "images/day/cloudy.jpg";
    } else if (condition === "partly-cloudy-night") {
        bg = "images/night/cloudy.jpg";
    } else if (condition === "rain") {
        bg = "images/night/rainy.jpg";
    } else if (condition === "clear-day") {
        bg = "images/day/clearly.jpg";
    } else if (condition === "clear-night") {
        bg = "images/night/clearly.jpg";
    } else {
        bg = "images/day/clearly.jpg";
    }
    body.style.backgroundImage = `url(${bg})`;
}

//get hours from hh:mm:ss
function getHour(time) {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if (hour > 12) {
        hour = hour - 12;
        return `${hour}:${min} PM`;
    } else {
        return `${hour}:${min} AM`;
    }
}

// convert time to 12 hour format
function covertTimeTo12HourFormat(time) {
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let ampm = hour >= 12 ? "pm" : "am";
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    let strTime = hour + ":" + minute + " " + ampm;
    return strTime;
}

// function to get day name from date
function getDayName(date) {
    let day = new Date(date);
    let days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return days[day.getDay()];
}

// function to get uv index status
function measureUvIndex(uvIndex) {
    if (uvIndex <= 2) {
        uvText.innerText = "Rendah";
    } else if (uvIndex <= 5) {
        uvText.innerText = "Normal";
    } else if (uvIndex <= 7) {
        uvText.innerText = "Tinggi";
    } else if (uvIndex <= 10) {
        uvText.innerText = "Sangat Tinggi";
    } else {
        uvText.innerText = "Ekstrim";
    }
}

// function to get humidity status
function updateHumidityStatus(humidity) {
    if (humidity <= 30) {
        humidityStatus.innerText = "Rendah";
    } else if (humidity <= 60) {
        humidityStatus.innerText = "Normal";
    } else {
        humidityStatus.innerText = "Tinggi";
    }
}

// function to get visibility status
function updateVisibiltyStatus(visibility) {
    if (visibility <= 0.03) {
        visibilityStatus.innerText = "Kabut Sangat Tebal";
    } else if (visibility <= 0.16) {
        visibilityStatus.innerText = "Kabut Tebal";
    } else if (visibility <= 0.35) {
        visibilityStatus.innerText = "Sedikit Berkabut";
    } else if (visibility <= 1.13) {
        visibilityStatus.innerText = "Sangat sedikit Berkabut";
    } else if (visibility <= 2.16) {
        visibilityStatus.innerText = "Sedikit Berembun";
    } else if (visibility <= 5.4) {
        visibilityStatus.innerText = "Sangat Sedikit Berembun";
    } else if (visibility <= 10.8) {
        visibilityStatus.innerText = "Terang";
    } else {
        visibilityStatus.innerText = "Sangat Terang";
    }
}

// function to get air quality status
function updateAirQualityStatus(airquality) {
    if (airquality <= 50) {
        airQualityStatus.innerText = "Aman";
    } else if (airquality <= 100) {
        airQualityStatus.innerText = "Normal";
    } else if (airquality <= 150) {
        airQualityStatus.innerText = "Sedikit Berbahaya";
    } else if (airquality <= 200) {
        airQualityStatus.innerText = "Tidak Sehat";
    } else if (airquality <= 300) {
        airQualityStatus.innerText = "Sangat Tidak sehat";
    } else {
        airQualityStatus.innerText = "Beracun";
    }
}

// function to handle search form
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let location = search.value;
    if (location) {
        currentCity = location;
        getWeatherData(location, currentUnit, hourlyorWeek);
    }
});

var currentFocus;
search.addEventListener("input", function (e) {
    removeSuggestions();
    var a,
        b,
        i,
        val = this.value;
    if (!val) {
        return false;
    }
    currentFocus = -1;

    a = document.createElement("ul");
    a.setAttribute("id", "suggestions");

    this.parentNode.appendChild(a);

    for (i = 0; i < cities.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (
            cities[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase()
        ) {
            /*create a li element for each matching element:*/
            b = document.createElement("li");
            /*make the matching letters bold:*/
            b.innerHTML =
                "<strong>" + cities[i].name.substr(0, val.length) + "</strong>";
            b.innerHTML += cities[i].name.substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + cities[i].name + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function (e) {
                /*insert the value for the autocomplete text field:*/
                search.value = this.getElementsByTagName("input")[0].value;
                removeSuggestions();
            });

            a.appendChild(b);
        }
    }
});


function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("active");
}

function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("active");
    }
}

function removeSuggestions() {
    var x = document.getElementById("suggestions");
    if (x) x.parentNode.removeChild(x);
}

// function to conver celcius to fahrenheit
function celciusToFahrenheit(temp) {
    return ((temp * 9) / 5 + 32).toFixed(1);
}

fahrenheitBtn.addEventListener("click", () => {
    changeUnit("f");
});
celciusBtn.addEventListener("click", () => {
    changeUnit("c");
});

// function to change unit
function changeUnit(unit) {
    if (currentUnit !== unit) {
        currentUnit = unit;
        tempUnit.forEach((elem) => {
            elem.innerText = `°${unit.toUpperCase()}`;
        });
        if (unit === "c") {
            celciusBtn.classList.add("active");
            fahrenheitBtn.classList.remove("active");
        } else {
            celciusBtn.classList.remove("active");
            fahrenheitBtn.classList.add("active");
        }
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
}

hourlyBtn.addEventListener("click", () => {
    changeTimeSpan("hourly");
});
weekBtn.addEventListener("click", () => {
    changeTimeSpan("week");
});

// function to change hourly to weekly or vice versa
function changeTimeSpan(unit) {
    if (hourlyorWeek !== unit) {
        hourlyorWeek = unit;
        if (unit === "hourly") {
            hourlyBtn.classList.add("active");
            weekBtn.classList.remove("active");
        } else {
            hourlyBtn.classList.remove("active");
            weekBtn.classList.add("active");
        }
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
}


cities = [{
    country: "IDN",
    name: "Jakarta",
    lat: "-6.1750",
    lng: "106.8275",
},
{
    country: "IDN",
    name: "Surabaya",
    lat: "-7.2458",
    lng: "112.7378",
},
{
    country: "IDN",
    name: "Medan",
    lat: "3.5894",
    lng: "98.6739",
},
{
    country: "IDN",
    name: "Malang",
    lat: "-7.9800",
    lng: "112.6200",
},
{
    country: "IDN",
    name: "Bekasi",
    lat: "-6.2349",
    lng: "106.9923",
}, {
    country: "IDN",
    name: "Banda Aceh",
    lat: "5.5500",
    lng: "95.3175",
},
{
    country: "IDN",
    name: "Tangerang",
    lat: "-6.1783",
    lng: "106.6319",
},
{
    country: "IDN",
    name: "Denpasar",
    lat: "-8.6500",
    lng: "115.2167",
},
{
    country: "IDN",
    name: "Sangereng",
    lat: "-6.2889",
    lng: "106.7181",
},
{
    country: "IDN",
    name: "Semarang",
    lat: "-6.9667",
    lng: "110.4167",
},
{
    country: "IDN",
    name: "Palembang",
    lat: "-2.9861",
    lng: "104.7556",
}, {
    country: "IDN",
    name: "Makassar",
    lat: "-5.1619",
    lng: "119.4362",
}, {
    country: "IDN",
    name: "Jepara",
    lat: "-6.5333",
    lng: "110.6667",
}, {
    country: "IDN",
    name: "Sumedang",
    lat: "-6.8400",
    lng: "107.9208",
},
{
    country: "IDN",
    name: "Manokwari",
    lat: "-0.8667",
    lng: "134.0833",
},
{
    country: "IDN",
    name: "Cilacap",
    lat: "-7.7167",
    lng: "109.0170",
},
{
    country: "IDN",
    name: "Bogor",
    lat: "-6.5966",
    lng: "106.7972",
},
{
    country: "IDN",
    name: "Pekanbaru",
    lat: "0.5092",
    lng: "101.4453",
},
{
    country: "IDN",
    name: "Samarinda",
    lat: "-0.5000",
    lng: "117.1378",
},
{
    country: "IDN",
    name: "Banjarmasin",
    lat: "-3.3200",
    lng: "114.5925",
},
{
    country: "",
    name: "Tasikmalaya",
    lat: "-7.3161",
    lng: "108.1975",
},
{
    country: "IDN",
    name: "Pontianak",
    lat: "-0.0206",
    lng: "109.3414",
},
{
    country: "IDN",
    name: "Cimahi",
    lat: "-6.8712",
    lng: "107.5548",
},
{
    country: "IDN",
    name: "Serang",
    lat: "-6.1200",
    lng: "106.1503",
},
{
    country: "IDN",
    name: "Jambi",
    lat: "-1.5900",
    lng: "103.6100",
},
{
    country: "IDN",
    name: "Balikpapan",
    lat: "-1.2768",
    lng: "116.8277",
},
{
    country: "IDN",
    name: "Magelang",
    lat: "-6.3528",
    lng: "108.3242",
},
{
    country: "IDN",
    name: "Surakarta",
    lat: "-7.5667",
    lng: "110.8167",
},
{
    country: "IDN",
    name: "Lembok",
    lat: "-8.5650",
    lng: "116.3510",
},
{
    country: "IDN",
    name: "Manado",
    lat: "1.4931",
    lng: "124.8413",
},
{
    country: "IDN",
    name: "Bandung",
    lat: "-6.9120",
    lng: "107.6097",
},
{
    country: "IDN",
    name: "Kupang",
    lat: "-10.1702",
    lng: "123.6077",
},
{
    country: "IDN",
    name: "Yogyakarta",
    lat: "-7.8014",
    lng: "110.3644",
},
{
    country: "IDN",
    name: "Mataram",
    lat: "-8.5833",
    lng: "116.1167",
},
{
    country: "IDN",
    name: "Jayapura",
    lat: "-2.5330",
    lng: "140.7170",
},
{
    country: "IDN",
    name: "Cilegon",
    lat: "-6.0027",
    lng: "106.0112",
},
{
    country: "IDN",
    name: "Ambon",
    lat: "-3.7000",
    lng: "128.1667",
},
{
    country: "IDN",
    name: "Cibinong",
    lat: "-6.4850",
    lng: "106.8420",
},
{
    country: "IDN",
    name: "Bengkulu",
    lat: "-3.7956",
    lng: "102.2592",
},
{
    country: "IDN",
    name: "Majalengka",
    lat: "-6.8353",
    lng: "108.2278",
},
{
    country: "IDN",
    name: "Cimanggis",
    lat: "-6.3645",
    lng: "106.8591",
},
{
    country: "IDN",
    name: "Tegal",
    lat: "-6.8667",
    lng: "109.1333",
},
{
    country: "IDN",
    name: "Pematangsiantar",
    lat: "2.9600",
    lng: "99.0600",
},
{
    country: "IDN",
    name: "Jember",
    lat: "-8.1727",
    lng: "113.6873",
},
{
    country: "IDN",
    name: "Mamuju",
    lat: "-2.6833",
    lng: "118.9000",
},
{
    country: "IDN",
    name: "Sorong",
    lat: "-0.8667",
    lng: "131.2500",
},
{
    country: "IDN",
    name: "Binjai",
    lat: "3.5986",
    lng: "98.4803",
},
{
    country: "IDN",
    name: "Kediri",
    lat: "-7.8111",
    lng: "112.0047",
},
{
    country: "IDN",
    name: "Palangkaraya",
    lat: "-2.2100",
    lng: "113.9200",
},
{
    country: "IDN",
    name: "Singaraja",
    lat: "-8.1167",
    lng: "115.0833",
},
{
    country: "IDN",
    name: "Probolinggo",
    lat: "-7.7500",
    lng: "113.2167",
},
{
    country: "IDN",
    name: "Madiun",
    lat: "-7.6300",
    lng: "111.5231",
},
{
    country: "IDN",
    name: "Ternate",
    lat: "0.7800",
    lng: "127.3819",
},
{
    country: "IDN",
    name: "Tarakan",
    lat: "3.3000",
    lng: "117.6333",
},
{
    country: "IDN",
    name: "Gorontalo",
    lat: "0.5333",
    lng: "123.0667",
},
{
    country: "IDN",
    name: "Batu",
    lat: "-7.8720",
    lng: "112.5250",
},
{
    country: "IDN",
    name: "Curug",
    lat: "-6.3711",
    lng: "106.8000",
},
{
    country: "IDN",
    name: "Purwakarta",
    lat: "-6.5533",
    lng: "107.4472",
},
{
    country: "IDN",
    name: "Salatiga",
    lat: "-7.3247",
    lng: "110.5444",
},
{
    country: "IDN",
    name: "Cianjur",
    lat: "-6.8200",
    lng: "107.1408",
},
{
    country: "IDN",
    name: "Mojokerto",
    lat: "-7.4722",
    lng: "112.4336",
},
{
    country: "IDN",
    name: "Payakumbuh",
    lat: "-0.2333",
    lng: "100.6333",
},
{
    country: "IDN",
    name: "Garut",
    lat: "-7.2167",
    lng: "107.9000",
},
{
    country: "IDN",
    name: "Indramayu",
    lat: "-6.3528",
    lng: "108.3242",
},
{
    country: "IDN",
    name: "Karanganyar",
    lat: "-7.6033",
    lng: "110.9778",
},
{
    country: "IDN",
    name: "Bukittinggi",
    lat: "-0.3097",
    lng: "100.3753",
},
{
    country: "IDN",
    name: "Merauke",
    lat: "-8.4932",
    lng: "140.4018",
},
{
    country: "IDN",
    name: "",
    lat: "",
    lng: "",
},
{
    country: "IDN",
    name: "",
    lat: "",
    lng: "",
},
];
