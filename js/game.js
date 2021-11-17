let timer = null;
const MAX = 3;
let n = 0;

const APPLICATION_KEY = "f87271f2388311ddfbb964cd19bbcc8cf556f0b94203f9caa36819b2d9235e7d";
const CLIENT_KEY = "75e7b36461236018d273b5cac4d6fa6d624d8880ae576659570f706e6fa527b3";
const ncmb = new NCMB(APPLICATION_KEY,CLIENT_KEY);
const DBName = "TestClass";

let TestClass = ncmb.DataStore(DBName);

function init() {
  if (timer == null) {
    start = new Date();
    time();
    gameStart();
  }
}

function gameStart() {
  let size = 5;
  let qNum = Math.floor(Math.random()*q.length);
  for (let i=0; i<size*size; i++) {
    let s = document.createElement("span");
    s.textContent = q[qNum][0];
    s.setAttribute("id", "num"+i);
    s.addEventListener("click", function(){
      if (this.textContent == q[qNum][1]) {
        //alert("正解");
        correct.play();
        n++;
        while (cells.firstChild) {
          cells.removeChild(cells.firstChild);
        }
        if (n == MAX) {
          // データの保存
          let test = new TestClass();
          let key = "message";
          test.set(key, parseInt(timer));
          test.save()
          .then (function(){
            console.log("成功");
          })
          .catch(function(err){
            console.log("エラー発生" + err);
          });
          // データの読み込み、High scoreの判定
            TestClass
            .order("message")
            .fetchAll()
            .then(function(results){
              for (let i=0; i<results.length; i++) {
                console.log(results[0].message);
                if (timer<=results[0].message) {
                  return alert("High score!: " + timer);
                }
                else {
                  return alert("Game clear! 時間は" + timer + "秒だった");
                }
              }
            })
            .catch(function(err){
              console.log("エラー発生" + err);
            });
        }
        gameStart();
      } else {
        wrong.play();
      }
    });
    cells.appendChild(s);
    if (i % size == size - 1) {
      const br = document.createElement("br");
      cells.appendChild(br);
    }
  }
  let p = Math.floor(Math.random()*size*size);
  let ans = document.getElementById("num" + p);
  ans.textContent = q[qNum][1];
}

function time() {
  let now = new Date();
  let eTime = parseInt((now.getTime() - start.getTime())/1000);
  score.textContent = eTime;
  timer = setTimeout("time()", 1000);
  if (n == MAX) {
    clearTimeout(timer);
  }
}
