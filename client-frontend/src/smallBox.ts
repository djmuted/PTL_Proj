export class SmallBox {
    public id: string;
    private boxDOM: HTMLElement;
    private nicknameDOM: HTMLElement;
    private videoBoxDOM: HTMLElement;
    public videoDOM: HTMLVideoElement;
    private isOnMain: boolean;

    constructor(_id: string, nickname: string, video: HTMLVideoElement) {
        this.id = _id;
        this.isOnMain = false;

        this.nicknameDOM = $('<div data-v-6afc1763="" class="small-nick"></div>').get()[0];
        this.videoBoxDOM = $('<div data-v-6afc1763="" class="small-video"></div>').get()[0];
        this.boxDOM = $('<div data-v-6afc1763="" data-v-058452d8="" class="column small-video-box"></div>').get()[0];

        this.videoDOM = video;
        this.videoDOM.style.minHeight = "100%";
        this.videoDOM.style.minWidth = "100%";
        this.nicknameDOM.innerText = nickname;

        this.videoBoxDOM.appendChild(this.videoDOM);
        this.boxDOM.appendChild(this.videoBoxDOM);
        this.boxDOM.appendChild(this.nicknameDOM);
        this.Show();
    }
    public UpdateName(newname: string) {
        this.nicknameDOM.innerText = newname;
    }
    public Show() {
        document.getElementById('small-videos').appendChild(this.boxDOM);
    }
    public Destroy() {
        if (this.isOnMain) {
            this.RemoveMain();
        }
        document.getElementById('small-videos').removeChild(this.boxDOM);

    }
    public SetMain() {
        this.isOnMain = true;
        $(this.boxDOM).addClass('main-vid');
        $(this.videoBoxDOM).removeClass('small-video');
        $(this.boxDOM).appendTo($('#main-vid'));
    }
    public RemoveMain() {
        this.isOnMain = false;
        $(this.boxDOM).removeClass('main-vid');
        $(this.videoBoxDOM).addClass('small-video');
        $(this.boxDOM).appendTo($('#small-videos'));
    }
}