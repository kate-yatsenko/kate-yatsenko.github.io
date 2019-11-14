const slider = document.getElementById('slider'),
    sliderItems = document.getElementById('slides'),
    back = document.getElementById('back'),
    next = document.getElementById('next');

export default class Index {
    constructor() {
        this._startPosition = 0;
        this._finishPosition = 0;
        this._positionThreshold = 100;
        this._slides = sliderItems.getElementsByClassName('slide');
        this._slidesLength = this._slides.length;
        this._slideSize = sliderItems.getElementsByClassName('slide')[0].offsetWidth;
        this._index = 0;
        this._allowShift = true;
        this._firstSlide = this._slides[0];
        this._lastSlide = this._slides[this._slidesLength - 1];
        this._init();
    }

    _init= () => {
        sliderItems.appendChild(this._firstSlide.cloneNode(true));
        sliderItems.insertBefore(this._lastSlide.cloneNode(true), this._firstSlide);
        sliderItems.addEventListener('mousedown', this.start);
        sliderItems.addEventListener('touchstart', this.start);
        sliderItems.addEventListener('touchend', this.finish);
        sliderItems.addEventListener('touchmove', this.process);
        sliderItems.addEventListener('transitionend', this.checkIndex);

        back.addEventListener('click',  () => this.changeSlide(-1));
        next.addEventListener('click',  () => this.changeSlide(1));

        slider.classList.add('loaded');
    };

    start = (e) => {
        e.preventDefault();
        this._posInitial = sliderItems.offsetLeft;

        if (e.type === 'touchstart') {
            this._startPosition = e.touches[0].clientX;
        } else {
            this._startPosition = e.clientX;
            document.onmouseup = this.finish;
            document.onmousemove = this.process;
        }
    };

    process = (e) => {
        if (e.type === 'touchmove') {
            this._finishPosition = this._startPosition - e.touches[0].clientX;
            this._startPosition = e.touches[0].clientX;
        } else {
            this._finishPosition = this._startPosition - e.clientX;
            this._startPosition = e.clientX;
        }
        sliderItems.style.left = (sliderItems.offsetLeft - this._finishPosition) + 'px';
    };

    finish = () => {
        this._posFinal = sliderItems.offsetLeft;
        if (this._posInitial - this._posFinal > this._positionThreshold) {
            this.changeSlide(1, true);
        } else if (this._posFinal - this._posInitial > this._positionThreshold) {
            this.changeSlide(-1, true);
        } else {
            sliderItems.style.left = this._posInitial + 'px';
        }

        document.onmouseup = null;
        document.onmousemove = null;
    };

    changeSlide = (dir, isDrag) => {
        sliderItems.classList.add('changing');

        if (this._allowShift) {
            if (!isDrag) this._posInitial = sliderItems.offsetLeft;
            if (dir === 1) {
                sliderItems.style.left = (this._posInitial - this._slideSize) + 'px';
                this._index++;
            } else if (dir === -1) {
                sliderItems.style.left = (this._posInitial + this._slideSize) + 'px';
                this._index--;
            }
        }

        this._allowShift = false;
    };

    checkIndex = () => {
        sliderItems.classList.remove('changing');

        if (this._index === -1) {
            sliderItems.style.left = -(this._slidesLength * this._slideSize) + 'px';
            this._index = this._slidesLength - 1;
        }

        if (this._index === this._slidesLength) {
            sliderItems.style.left = -this._slideSize + 'px';
            this._index = 0;
        }

        this._allowShift = true;
    };
}


