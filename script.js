const key = '5575b0e31c3b1b31eae69519360ad915'
const urlWetherCurrent = `https://api.openweathermap.org/data/2.5/weather?q=Minsk&appid=${key}`
const urlWetherByDays = `https://api.openweathermap.org/data/2.5/forecast?q=Minsk&appid=${key}`


fetch(urlWetherCurrent, { method: 'GET' })
    .then((response) => response.json())
    .then((dataObject) => new HeaderDataWidget(dataObject))


class HeaderDataWidget {
    constructor(data) {
        this.city = data.name
        this.windDeg = data.wind.deg
        this.windSpeed = data.wind.speed
        this.date = new Date(data.dt * 1000)
        this.temp = data.main.temp - 273.15
        this.countryCode = data.sys.country
        this.description = data.weather[0].description
        this.iconSrc = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        this.renderHeader()

    }

    createWindName() {
        let resultWindDeg = ''
        if (this.windDeg == 0) {
            resultWindDeg = 'Северный'
        } else if (this.windDeg < 90) {
            resultWindDeg = 'Северо-восточный'
        } else if (this.windDeg == 90) {
            resultWindDeg = 'Восточный'
        } else if (this.windDeg < 180) {
            resultWindDeg = 'Юго-восточный'
        } else if (this.windDeg == 180) {
            resultWindDeg = 'Южный'
        } else if (this.windDeg < 270) {
            resultWindDeg = 'Юго-западный'
        } else if (this.windDeg == 270) {
            resultWindDeg = 'Западный'
        } else if (this.windDeg > 270) {
            resultWindDeg = 'Северо-западный'
        }
        return resultWindDeg
    }


    createWidgetTemplate() {

        const resultTemp = Math.round(this.temp) > 0 ? '+' + Math.round(this.temp) : Math.round(this.temp)
        const resultWindDegree = this.createWindName()

        return `
            <div class="widget">
                <div class="header-widget">
                    <div class="first-part-header-widget">${this.city},${this.countryCode} <br> ${this.date.getHours()}:${(this.date.getMinutes() < 10 ? '0' : '') + (this.date.getMinutes())}</div>
                    <div class="second-part-header-widget">
                        <img src="${this.iconSrc}" alt="icon">
                        <h5 class="description">${this.description}</h5>
                        <h2>${resultTemp}&degC</h2>
                    </div>
                    <div class="third-part-header-widget">
                        <div>${resultWindDegree}</div>
                        <div>${this.windSpeed} м/с</div>
                    </div>
                </div>
                
            </div>
        `
    }
    renderHeader() {
        document.body.innerHTML = this.createWidgetTemplate()
    }

}


fetch(urlWetherByDays, { method: 'GET' })
    .then((response) => response.json())
    .then((data) => {
        const newData = data.list.filter(function (value, index) {
            return index % 8 == 0;
        })
        return newData
    })
    .then((newData)=>{
        for (item of newData){
            const itemDataWidget = new ItemDataWidget(item)
        }
    })



class ItemDataWidget {
    constructor(data) {
        this.date = new Date(data.dt * 1000)
        this.temp = data.main.temp - 273.15
        this.iconSrc = `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
        this.renderItem()
    }

    createItemWidgetTemplate(){
        const resultTemp = Math.round(this.temp) > 0 ? '+' + Math.round(this.temp) : Math.round(this.temp)
        return `
        <div class="item-widget">
            <div class="item-date"><h5>${this.date.getFullYear()}-${this.date.getMonth()}-${this.date.getDate()} <br> ${this.date.getHours()}:${(this.date.getMinutes()<10?'0':'') + (this.date.getMinutes())} </div>
            <div class="item-icon">
                <img src="${this.iconSrc}" alt="icon">            
            </div>
            <div class="item-temp"><h5>${resultTemp}&degC</h5></div>
        </div>
        `
    }
    
    renderItem() {
        document.body.innerHTML +=  this.createItemWidgetTemplate()   
    }


}





