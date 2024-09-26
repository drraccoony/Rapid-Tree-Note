class HeaderComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 10vh; width: 100%;">
            <div style="width: 50%; display: flex; align-items: center; justify-content: left;">
            <h1 style="color: whitesmoke; font-size: 4vw;">Rapid Tree Notetaker</h1>
            </div>
            <div class="navigation-btn-div">
            <button onclick="navigateProgram()" class="navigation-btn">Program</button>
            </div>
            <div class="navigation-btn-div btn-implementation">
            <button onclick="navigateImplementation()" class="navigation-btn">Implementation</button>
            </div>
            <div class="navigation-btn-div">
            <button onclick="navigateInspiration()" class="navigation-btn">Inspiration</button>
            </div>
            <div class="navigation-btn-div">
            <button onclick="navigateCredits()" class="navigation-btn">Credits</button>
            </div> 
            <div class="logo-container">
            <img src="./Resources/images/RTN-Logo.svg" alt="RTN Website Logo" class="logo-img"></img>
            </div>
        </div>
        `;
    }
}

customElements.define('header-component', HeaderComponent);