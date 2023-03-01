 // 1. Render songs
        // 2. Scroll top
        // 3. Play/pause/ seek
        // 4. CD rotate
        // 5. Next/ prev
        // 6. Random
        // 7. Next/ repeat when ended
        // 8. Active song
        // 9. Scroll active song into view
        // 10. Play song when clicked


        
        const $ = document.querySelector.bind(document);
        const $$ = document.querySelectorAll.bind(document);

        const PLAYER_STORAGE_KEY = 'F8_PLAYER';
		// const dashboard = $('.dashboard');
        const body = $('body');
        const heading = $('header h2');
        const player = $('.player');
        const cdThumb = $('.cd-thumb');
        const audio = $('#audio');
        const cd = $('.cd');
        const playBtn = $('.btn-toggle-play');
        const progressBar = $('#progress');
        const nextBtn = $('.btn-next');
        const prevBtn = $('.btn-prev');
        const randomBtn = $('.btn-random');
        const repeatBtn = $('.btn-repeat');
        const playList = $('.playlist');
        const app = {
            currentIndex: 0,
            isPlay: false,
            isRandom: false,
            isRepeat: false,
            config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))||{}, 
            songs: [
            { name: 'Kìa bóng dáng ai',
              singer: 'Pháo',
              path: './assets/mp3/phao.mp3',
              image: './assets/img/phao.jpeg'
            },
            { name: 'Don\'t côi',
              singer: 'RPT Orijinn',
              path: './assets/mp3/dontcoi.mp3',
              image: './assets/img/dontcoi.jpg'
            },
            { name: 'To the moon',
              singer: 'Hooligan',
              path: './assets/mp3/tothemoon.mp3',
              image: './assets/img/tothemoon.jpg'
            },
            { name: 'Vội vàng',
              singer: 'Tạ Quang Thắng',
              path: './assets/mp3/voivang.mp3',
              image: './assets/img/voivang.jpg'
            },
            { name: 'Ánh Sao và Bầu Trời',
              singer: 'T.R.I x Cá',
              path: './assets/mp3/starlight.mp3',
              image: './assets/img/starlight.jpg'
            },
            { name: 'Xin lỗi',
              singer: 'Tuấn Ngọc x Hà Anh Tuấn',
              path: './assets/mp3/sorry.mp3',
              image: './assets/img/sorry.jpg'
            },
			      { name: 'Xin lỗi',
              singer: 'Tuấn Ngọc x Hà Anh Tuấn',
              path: './assets/mp3/sorry.mp3',
              image: './assets/img/sorry.jpg'
            },
          ],
            setConfig: function(key,value){
                this.config[key] = value;
                localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))  
          },
            
          render: function(){
              
              const html = this.songs.map((song,index) => {
                return `
                <div class="song ${index === this.currentIndex ? 'active': ''}" data-index = "${index}" >
                    <div class="thumb" style="background-image: url('${song.image}')"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
                `
              })
              playList.innerHTML = html.join('');
              // console.log(typeof(app.songs[this.currentIndex].image))
              const imagePath = app.songs[this.currentIndex].image;
              body.style.backgroundImage = `url('${imagePath}')`;

          },
          defineProperties: function (){
                Object.defineProperty(this, 'currentSong', {
                    get: function () {
                        return this.songs[this.currentIndex]
                    }
                })
          },
            handleEvents: function(){
                const cdWidth = cd.offsetWidth;

                // Progressing CD rotating and pausing
                const cdThumbAnimate = cdThumb.animate([
                  { transform: 'rotate(360deg)'}
                ], { duration: 10000,
                     iterations: Infinity  
                })
                cdThumbAnimate.pause();

                //Progressing zoom in/out CD
                document.onscroll = function(){
                    const scrollTop = window.scrollY || document.documentElement.scrollTop;
                    const newCdWidth = cdWidth - scrollTop;
                    cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0;
                    cd.style.opacity = newCdWidth / cdWidth;
					
                }

                //Changing the background
                
                //Progressing when click
                playBtn.onclick = function(){ 
                    if(app.isPlay){
                        audio.pause();
                    }else {
                        audio.play();
                    }
                }

                  //when song is playing
                  audio.onplay = function(){
                    app.isPlay = true;
                    player.classList.add('playing');
                    cdThumbAnimate.play();
                }
                
                //when song is pausing
                audio.onpause = function(){
                    app.isPlay = false;
                    player.classList.remove('playing');
                    cdThumbAnimate.pause();
                }

                //When song's progress changed
                audio.ontimeupdate = function(){
                    if(audio.duration){
                        const progressPercents = Math.floor(audio.currentTime / audio.duration * 100);
                        progress.value = progressPercents
                    }
                }

                //Progressing on change
                progress.oninput = function(e){
                    const seekTime = e.target.value*audio.duration/100;
                    audio.currentTime = seekTime;
                }
				
				//When next song
				nextBtn.onclick = function(){
					if(app.isRandom){
						app.playRandomSong()
					}else {
						app.nextSong();
					}
					//CLicked btn next and prev then audio play
					audio.play(); 
					app.render();
					app.scrollToActiveSong();
				}
				//When prev song
				prevBtn.onclick = function(){
					if(app.isRandom){
						app.playRandomSong()
					}else 
					{
						app.prevSong();
					}
					
					audio.play();
					app.render();
				}

				//When random btn was clicked
				randomBtn.onclick = function(){
					app.isRandom = !app.isRandom;
					app.setConfig('isRandom', app.isRandom);
					randomBtn.classList.toggle('active', app.isRandom);
				}
				//Progressing repeat song
				repeatBtn.onclick = function(){
					app.isRepeat = !app.isRepeat;
					app.setConfig('isRepeat', app.isRepeat);
					repeatBtn.classList.toggle('active', app.isRepeat);
				}
				//Progressing next Song when audio ended
				audio.onended = function(){
					if(app.isRepeat){
						audio.play();
					}else{
						nextBtn.click();
					}	
				}

				//Listen behavior click on playlist
				playList.onclick = function(e){
					//closet return itself or parent
					const songNode = e.target.closest('.song:not(.active)');
					if(songNode||e.target.closest('.option')){
						//Progressing when click on song bar
						if(songNode){
							// dataset
							//
							app.currentIndex = Number(songNode.dataset.index);
							app.loadCurrentSong(songNode);
							app.render();
							audio.play();
						}
						// Progressing when click on song's option
					}
				}
            }, 
            scrollToActiveSong: function(){
              setTimeout(() => {
                
                $('.song.active').scrollIntoView({
                  // Configuring ?
                  
                  behavior: 'smooth',
                  block: 'end',
                });
              },300)
            },
            loadCurrentSong: function(){
                
                heading.textContent = this.currentSong.name;
                cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
                audio.src = this.currentSong.path;
            },
            loadConfig: function(){
              this.isRandom = this.config.isRandom;
              this.isRepeat = this.config.isRepeat;
            },
            nextSong: function(){
                this.currentIndex++;
                if(this.currentIndex >= this.songs.length){
                  this.currentIndex = 0;
                }
                this.loadCurrentSong()
                    },
            prevSong: function(){
              this.currentIndex--;
              if(this.currentIndex < 0)
              {
                this.currentIndex = this.songs.length - 1;
              }
              this.loadCurrentSong();
            },
            playRandomSong: function(){
              let newIndex;
              do{
                newIndex = Math.floor(Math.random()*app.songs.length);
              }while (newIndex === this.currentIndex)

              this.currentIndex = newIndex;
              this.loadCurrentSong();
            },
            start: function(){
                //Assigning configured from config into application
                this.loadConfig();
               
                //Defining the properties for Object
                this.defineProperties();

                // Lang nghe / xu ly cac su kien DOM events
                this.handleEvents();

                //Upload firstSong's information into UI when running application
                this.loadCurrentSong();
                
                // Render playlist
                this.render()
                
                //Show first stage of btn repeat and random
                randomBtn.classList.toggle('active', app.isRandom);
                repeatBtn.classList.toggle('active', app.isRepeat);
          }
        }
        app.start();