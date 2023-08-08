// Fetch Data from API:https://test-data-gules.vercel.app/data.json

function getData() {
  fetch("https://test-data-gules.vercel.app/data.json")
    .then((res) => res.json())
    .then((data) => {
      let output = "";
      let totalQuestions = 0;

      data.data.forEach((category) => {
        output += ` <div class="accordion">
          <div class="accordion-item">
            <div class="accordion-item-header" id="${category.sl_no}">
            ${category.sl_no} | ${category.title}
            </div>
            <div class="accordion-item-body">
              <div class="accordion-item-body-content">
  
                <table class="rwd-table">
                  <tbody>
                    <tr>
                      <th>Actions</th>
                      <th>Problem [Articles, Codes]</th>
                      <th>PL-1 </th>
                      
                      <th>YT Link</th>
                      <th>Bookmark</th>
                    </tr>
  
  
                    ${category.ques
                      .map(
                        (question) => `
                    <tr class="question-row ">
                      <td data-th="que-check">
                        <input type="checkbox" class="checkmark" id="${question.id}">
                      </td>
                      <td data-th="que-title">
                       ${question.title}
                      </td>
                      <td data-th="que-p1">
                        <div class="que-logo">
                          <a href="${question.p1_link}"> <img src="images/cod-nin.jpeg" alt="" srcset="" class="logo"></a>
                        </div>
                      </td>
                     
                      <td data-th="que-ytlink">
                        <div class="que-logo">
                        <a href="${question.yt_link}"><img src="images/youtube.png" alt="" srcset="" class="logo"></a>
                        </div>
                      </td>
                      <td data-th="bookmark">
                        <button class="book-btn" id="${question.id}"><img src="images/book.svg" ></button>
                       
                      </td>
                    </tr>
                    
                  `
                      )
                      .join("")}
  
                  </tbody>
                </table>
  
  
  
              </div>
            </div>
  
          </div>
  
        </div>`;

        totalQuestions += category.ques.length;
        document.getElementById("num2").innerText = totalQuestions;
      });

      console.log("Total questions fetched: " + totalQuestions);

      document.getElementById("acc-wrapper").innerHTML = output;

      // For Accordion

      const accordionItemh = document.querySelectorAll(
        ".accordion-item-header"
      );

      accordionItemh.forEach((accordionItemHeader) => {
        accordionItemHeader.addEventListener("click", (e) => {
          console.log("clicked");
          const activeheader = document.querySelector(
            ".accordion-item-header.active"
          );
          if (activeheader && activeheader !== accordionItemHeader) {
            activeheader.classList.toggle("active");
            activeheader.nextElementSibling.style.maxHeight = 0;
          }
          accordionItemHeader.classList.toggle("active");
          const accordionItemBody = accordionItemHeader.nextElementSibling;
          if (accordionItemHeader.classList.contains("active")) {
            accordionItemBody.style.maxHeight =
              accordionItemBody.scrollHeight + "px";
          } else {
            accordionItemBody.style.maxHeight = 0;
          }
        });
      });

      // end accordion

     

      let checkstored = JSON.parse(localStorage.getItem("checkstored")) || {};

      let countcourse = 0;
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');

      // function to updateProgressBar

      function updateProgressBar(countcourse, totalQuestions) {
        let progressWidth = (countcourse / totalQuestions) * 100;
        const barWidth = document.getElementById("myBar");
        barWidth.style.width = `${progressWidth}%`;
      }

      // for backgorund color after reload and uodate progress bar

      checkboxes.forEach((checkbox) => {
        const row = checkbox.closest(".question-row");
        const checkboxId = checkbox.getAttribute("id");

        if (checkstored[checkboxId]) {
          checkbox.checked = true;
          row.classList.add("green-background");
          countcourse++;
        } else {
          checkbox.checked = false;
          row.classList.remove("green-background");
        }
      });

      updateProgressBar(countcourse, totalQuestions);

      document.getElementById("num1").innerText = countcourse;


      // add backgriund color green
      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
          const row = checkbox.closest(".question-row");

          if (checkbox.checked) {
            row.classList.add("green-background");
            countcourse++;
          } else {
            row.classList.remove("green-background");
            countcourse--;
          }
          
          // Storing checkboxes
          const checkstored = {};
          checkboxes.forEach((cb) => {
            const checkboxId = cb.getAttribute("id");
            checkstored[checkboxId] = cb.checked;
          });
          localStorage.setItem("checkstored", JSON.stringify(checkstored));

          updateProgressBar(countcourse, totalQuestions);
          document.getElementById("num1").innerText = countcourse;

          // console.log(countcourse);
          // console.log(totalQuestions);

          // document.getElementById('num1').innerText = countcourse;
          // let progressWidth = (countcourse / totalQuestions)*100;
          // console.log(progressWidth);

          // const barWidth = document.getElementById('myBar');
          // barWidth.style.width = `${progressWidth}%`;
        });
      });

      // for keyboards e to naviagte through question

      let activequeind = 0;
      const qrow = document.querySelectorAll(".question-row");
      document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          qrow[activequeind].classList.remove("active-que");
          if (e.key === "ArrowUp") {
            activequeind = (activequeind - 1 + qrow.length) % qrow.length;
          } else if (e.key === "ArrowDown") {
            activequeind = (activequeind + 1) % qrow.length;
          }

          qrow[activequeind].classList.add("active-que");
        }
      });

      // end keyboard events
      // Arrow up and arrow down for questions

      // for Search Option ,to search with category and with question

      const searchInput = document.getElementById("search");
      searchInput.addEventListener("input", searchImp);

      function searchImp() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        searchCat(searchTerm);
        console.log(searchTerm);
      }

      function searchCat(searchTerm) {
        const accordionItems = document.querySelectorAll(".accordion-item");

        accordionItems.forEach((item) => {
          const categoryTitle = item
            .querySelector(".accordion-item-header")
            .textContent.toLowerCase();

          const questions = item.querySelectorAll(".question-row");
          let matchQue = 0;

          questions.forEach((question) => {
            const questionTitle = question
              .querySelector('[data-th="que-title"]')
              .textContent.toLowerCase();

            if (questionTitle.includes(searchTerm)) {
              question.style.display = "table-row";
              matchQue++;
            } else {
              question.style.display = "none";
            }

            // console.log(matchQue);
          });

          // if(categoryTitle.includes(searchTerm)){
          //   item.style.display = 'block';
          // }else{
          //   item.style.display = 'none';
          // }
          if (matchQue || categoryTitle.includes(searchTerm)) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      }
    })

    .catch((err) => console.log(err));
}

getData();


function getBook() {
  fetch("https://test-data-gules.vercel.app/data.json")
    .then((res) => res.json())
    .then((data) => {
      function bookmarkQuestion(questionId) {
        const bookQue = JSON.parse(localStorage.getItem("bookQue")) || [];
        if (!bookQue.includes(questionId)) {
          bookQue.push(questionId);
          alert("Bookmark Added")
          localStorage.setItem("bookQue", JSON.stringify(bookQue));

          // Display bookmark in book section
          const bookList = document.getElementById("bookmarked-questions-list");
          const bookoutput = document.getElementById("bookoutput");

          data.data.forEach((category) => {
            category.ques.forEach((question) => {
              if (bookQue.includes(question.id)) {
                console.log(category.ques)
                const row = document.createElement("tr");
                row.innerHTML = `
            <td>${question.title}</td>
            
            <td data-th="que-p1">
            <div class="que-logo">
              <a href="${question.p1_link}"> <img src="images/cod-nin.jpeg" alt="" srcset="" class="logo"></a>
            </div>
          </td>
          `;
                bookList.appendChild(row);
              }
            });
          });
        }else{
          alert("Already Added")
        }
      }

      const bookmarkButtons = document.querySelectorAll(".book-btn");
      bookmarkButtons.forEach((buttons) => {
        buttons.addEventListener("click",(e) => {
          const questionId =e.target.parentElement.id;
          console.log(questionId);
          
         

          bookmarkQuestion(questionId);
        });
      });

      // Display bookmark questions on page load
      const bookQue = JSON.parse(localStorage.getItem("bookQue")) || [];
      const bookList = document.getElementById("bookmarked-questions-list");
      
      data.data.forEach((category) => {
        category.ques.forEach((question) => {
          if (bookQue.includes(question.id)) {
            console.log(question.title);
            const row = document.createElement("tr");
            row.classList.add("question-row")
            row.innerHTML = `
            
          
              <td data-th="que-check">
                <input type="checkbox" class="checkmark" id="${question.id}">
              </td>
              <td data-th="que-title">
               ${question.title}
              </td>
              <td data-th="que-p1">
                <div class="que-logo">
                  <a href="${question.p1_link}"> <img src="images/cod-nin.jpeg" alt="" srcset="" class="logo"></a>
                </div>
              </td>
             
              <td data-th="que-ytlink">
                <div class="que-logo">
                <a href="${question.yt_link}"><img src="images/youtube.png" alt="" srcset="" class="logo"></a>
                </div>
              </td>
              
            
      
      `;
            bookList.appendChild(row);
          }
        });
      });
    })

    .catch((err) => console.log(err));
}

getBook();





// dark mode implemented

const body = document.querySelector("body");
const nav = document.querySelector("nav");
const progressbardes = document.querySelector(".progress-bar-des");
const statusInfo = document.querySelector(".status-info");
const bookMarkbtn = document.querySelector(".bookmark-box-btn");
const accorDion = document.querySelector(".accordion-item");
const barWrap = document.querySelector(".bar-wrap");
const queComp = document.querySelector(".que-comp");
const accWrapper = document.querySelector("#acc-wrapper");
const container = document.querySelector(".container");

toggle = document.querySelector(".toggle");

toggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  bookMarkbtn.classList.toggle("dark-book-btn");
  nav.classList.toggle("dark-nav");
  progressbardes.classList.toggle("dark-prog");
  statusInfo.classList.toggle("dark-status-info");
  document.querySelector(".bar").classList.toggle("dark-bar");

  accWrapper.classList.toggle("dark-wrapper");
  barWrap.classList.toggle("dark-bar-wrap");
});
toggle.addEventListener("click", () => toggle.classList.toggle("active"));

// enddark mode

// Responsive Navbar

const openBtn = document.querySelector("#open-btn");
const closeBtn = document.querySelector("#close-btn");
const searchBox = document.querySelector(".search-box");
const features = document.querySelector(".features");

openBtn.addEventListener("click", () => {
  searchBox.style.display = "block";
  features.style.display = "flex";
  openBtn.style.display = "none";
  closeBtn.style.display = "inline-block";
});
closeBtn.addEventListener("click", () => {
  searchBox.style.display = "none";
  features.style.display = "none";
  closeBtn.style.display = "none";
  openBtn.style.display = "inline-block";
});

//Responsive
