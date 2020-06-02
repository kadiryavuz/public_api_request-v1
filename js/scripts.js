/**
 * EmployeeDirApp class - with no constructor params
 */
class EmployeeDirApp {
    constructor() {
        //12 results with gb and us nationals - https://randomuser.me/documentation
        this.fetchUrl = 'https://randomuser.me/api/?results=12&nat=us,gb';

        //main DOM elements
        this.galleryEl = document.getElementById('gallery');
        this.searchEl = document.getElementsByClassName('search-container')[0];

        //initializers - pp logic
        this.data = null;
        this.filteredData = null;
        this.modalEl = null;
        this.activeEmployeeCard = null;
        this.activeEmployeeInfo = null;
        this.totalModalGeneration = 0;
        this.modalCreationError = null;
    }

    /**
     * init -> as starter method
     */
    init = () => {
        //bind search field to document
        this.generateSearch();

        //receive data
        this.fetchdata();

        //apply event handles for search form
        this.registerSearchEvents();
    }

    /**
     * fetchdata - to fetch the data and bind the results to galery view
     * if error occurs galery view will include a simple err text
     */
    fetchdata = () => {
        fetch(this.fetchUrl)
            .then(data => data.json())
            .then(json => this.data = json.results)
            .catch((err) => this.generateFetchError(err, this.galleryEl))
            .finally(() => this.generateCards(''));
    }

    /**
     * generateFetchError - helper to bind fetch error result
     */
    generateFetchError = (error, target) => {
        target.innerHTML = `<p>An error has occured while fetching the data</p>`;
        console.warn('Error on fetching: ', error);
    }

    /**
     * generateModalError - helper to bind modal error when an error occurs while parsing/ playing the data
     */
    generateModalError = () => {

        console.warn('Error on fetching: ', this.modalCreationError);
        return `
            <div class="modal-info-container">
                <h3 id="name" class="modal-name cap">Error!</h3>
                <p class="modal-text">Data cannot be parsed: ${this.modalCreationError}</p>
            </div>
        `;
    }

    
    /**
     * generateSearch - helper to bind search component
     */
    generateSearch = () => {

        this.searchEl.innerHTML = `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>
        `;
    }

   
    /**
     * generateCards - helper to bind filtered results - if any - to galery area
     * @param {string} filterText The value to filter the API response
     */
    generateCards = (filterText) => {

        if (this.data) {
            this.filteredData = this.data.filter(s => s.name.first.toLowerCase().indexOf(filterText.toLowerCase()) > -1);
            if(this.filteredData.length === 0) {
                this.galleryEl.innerHTML = '<h4>No User(s) Found</h4>';
            } else {
                const cards = this.filteredData.map(user => {
                    return `
                        <div class="card" id="${user.login.uuid}" onclick='window.EmployeeJS.selectCard(this)'>
                            <div class="card-img-container">
                                <img class="card-img" src="${user.picture.medium}" alt="profile picture">
                            </div>
                            <div class="card-info-container">
                                <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                                <p class="card-text">${user.email}</p>
                                <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
                            </div>
                        </div>
                    `;
                });
    
                let galleryCards = cards.join('');
                this.galleryEl.innerHTML = galleryCards;
            }
            
        }
    }

     /**
     * selectCard - sets activeCard and Info data upon user interaction
     * applies styling to selected card
     * calls modal generation
     * @param {HTMLElement} el The value to filter the API response
     */
    selectCard = (el) => {

        try {
            if (el) {
                if (this.totalModalGeneration > 0) {
                    this.activeEmployeeCard.classList.remove('selectedCard');
                }

                this.activeEmployeeCard = el;
                this.activeEmployeeCard.classList.add('selectedCard');
                this.activeEmployeeInfo = this.filteredData[this.filteredData.findIndex(d => d.login.uuid === el.getAttribute('id'))];
            }

            this.generateModal();

        } catch (error) {
            this.modalCreationError = error;
            console.warn("Select Card - Err: ", error);
        }

    }

     /**
     * generateModal - manages container element & sets inner modal content and displays error if any when parsed/ played
     */
    generateModal = () => {
        if (!this.modalEl) {
            this.modalEl = document.createElement('div');
            this.modalEl.className = "modal-container";
        }
        let template;
        const currentIndex = this.filteredData.findIndex(user => user.login.uuid === this.activeEmployeeCard.getAttribute('id'));
        if (!this.modalCreationError) {
            template = `
            <div class="modal">
                <button type="button" id="modal-close-btn" onclick="window.EmployeeJS.close()" class="modal-close-btn"><strong>X</strong></button>
                ${this.generateModalInner(this.activeEmployeeInfo)}
            </div>
            ${this.generateModalButtons(currentIndex)}
            `;
        } else {
            template = `
            <div class="modal">
                <button type="button" id="modal-close-btn" onclick="window.EmployeeJS.close()" class="modal-close-btn"><strong>X</strong></button>
                ${this.generateModalError()}
            </div>
            `;
        }


        this.modalEl.innerHTML = template;

        if (this.totalModalGeneration === 0) {
            document.body.appendChild(this.modalEl);
            this.galleryEl.parentNode.insertBefore(this.modalEl, this.galleryEl.nextSibling);
        }
        this.totalModalGeneration++;

    }

    /**
     * generateModalButtons - generates the content for button area of the modal
     * @param {Number} currentIndex The value to identify page place of currently selected card
     */
    generateModalButtons = (currentIndex) => {
        const isPrevSetDisabled = (currentIndex === 0);
        const isNextSetDisabled = (currentIndex === this.filteredData.length - 1);

        if (isPrevSetDisabled && isNextSetDisabled) {
            return ``;
        } else {
            return `
            <div class="modal-btn-container" onclick="window.EmployeeJS.applyStatus()" >
                <button type="button" id="modal-prev" ${(isPrevSetDisabled) ? 'disabled' : ''} onclick="window.EmployeeJS.goPrev()" class='${(isPrevSetDisabled) ? 'disabledButton' : 'modal-prev btn'}'>Prev</button>
                <button type="button" id="modal-next" ${(isNextSetDisabled) ? 'disabled' : ''} onclick="window.EmployeeJS.goNext()" class='${(isNextSetDisabled) ? 'disabledButton' : 'modal-next btn'}'>Next</button>
            </div>
        `;
        }


    }

     /**
     * applyStatus - controls button eligibility - if not eligible to go prev or next then button becomes disabled and regarding styles are applied
     */
    applyStatus = () => {
        if (event.target.tagName === 'BUTTON') {
            const currentIndex = this.filteredData.findIndex(user => user.login.uuid === this.activeEmployeeCard.getAttribute('id'));
            const nextBtn = document.getElementById('modal-next');
            const prevBtn = document.getElementById('modal-prev');
            if (currentIndex === this.filteredData.length - 1 && nextBtn) {
                nextBtn.disabled = true;
                nextBtn.className = 'disabledButton';
            } else {
                if (nextBtn) {
                    nextBtn.removeAttribute('disabled');
                    nextBtn.className = 'modal-next btn';
                }
            }

            if (currentIndex === 0 && prevBtn) {
                prevBtn.disabled = true;
                prevBtn.className = 'disabledButton';
            } else {
                if (prevBtn) {
                    prevBtn.removeAttribute('disabled');
                    prevBtn.className = 'modal-prev btn';
                }
            }
        }

    }


    /**
     * generateModalInner - generates the content for inner modal
     * @param {Object} data Object to feed the modal inner
     */
    generateModalInner = (data) => {
       
        return `
            <div class="modal-info-container">
                <img class="modal-img" src="${data.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${data.name.first} ${data.name.last}</h3>
                <p class="modal-text">${data.email}</p>
                <p class="modal-text cap">${data.location.city}</p>
                <hr>
                <p class="modal-text">${data.phone}</p>
                <p class="modal-text">${data.location.street.name}, ${data.location.city}, OR ${data.location.postcode}</p>
                <p class="modal-text">Birthday: ${new Date(data.dob.date).toLocaleDateString()}</p>
            </div>
            `;
    }

    /**
     * goNext - sets the activeCard with the next element and re-initialize flow with selectcard method
     */
    goNext = () => {
        const nextEl = this.activeEmployeeCard.nextElementSibling;

        this.selectCard(nextEl);

    }

    /**
     * goPrev - sets the activeCard with the prev element and re-initialize flow with selectcard method
     */
    goPrev = () => {
        const prevEl = this.activeEmployeeCard.previousElementSibling;

        this.selectCard(prevEl);
    }

    /**
     * close - removes modal child element and resets class initializers
     */
    close = () => {
        //delete all modal setup it will render again in the next card selection
        this.galleryEl.parentNode.removeChild(this.modalEl);
        this.activeEmployeeCard.classList.remove('selectedCard');
        this.activeEmployeeCard = null;
        this.activeEmployeeInfo = null;
        this.totalModalGeneration = 0;
        this.modalCreationError = null;

    }

    /**
     * registerSearchEvents - registers form for search element with submit and search events
     */
    registerSearchEvents = () => {
        const form = document.getElementsByTagName('form')[0];
        form.addEventListener('submit', (e) => {
            const inputVal = e.target.elements[0].value;
            this.generateCards(inputVal);
        })

        form.addEventListener('search', (e) => {
            this.generateCards(e.target.value);
        })
    }
}

/**
 * initializing EmployeeJS to be loaded on window
 * with the new instance of app class when dom is parsed and ready
 */
window.addEventListener('DOMContentLoaded', (event) => {
    window.EmployeeJS = new EmployeeDirApp();
    window.EmployeeJS.init();
});