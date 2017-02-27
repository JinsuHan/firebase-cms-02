# Firebase Cms 02

##CMS firebase 적용 방법


##적용 순서

###1) 구글 firebase 프로젝트 생성
>https://firebase.google.com/
>프로젝트명은 4자 이상 중복 불가

###2) 기본
<pre>
이메일/비밀번호, google 가입 가능 설정
데이터 베이스 읽기 쓰기 권한을 수정 한다.

{"rules": { ".read": true, ".write": true }}
</pre>

###3) hosting 
<pre>
firebase console 도구 설치

$ npm install -g firebase-tools

터미널 에서 firebase login 으로 로그인
firebase init 로 기본 설정 (프로젝트 폴더, db, hosting 사용 여부)
추가 서버 없이 파일을 실행하여도 테스트가 가능
터미널에서 firebase serve 로 로컬서버 사용 가능, 경로는 init 명령에서 선택한 폴더
</pre>

###4) firebase 적용
<pre>
프로젝트 페이지 > overview > 웹 앱에 firebase 추가하기 > 스니펫 획득
<code>
var config = {
 apiKey: "your key",
 authDomain: "your-domain.firebaseapp.com",
 databaseURL: "https://your-domain.firebaseio.com",
 storageBucket: "your-domain.appspot.com",
  messagingSenderId: "0000000"
};
</code>
형태이며 js/init.js 에 삽입
</pre>

###5) 배포
<pre>
firebase use --add 로 프로젝트 추가(원하는 이름을 입력하여 저장 가능)
firebase use *name* 으로 프로젝트 선택이 가능
firebase init 에서 설정한 경로에 파일을 넣고 firebase deploy 명령을 사용
</pre>

###6) 시작하기
<pre>
첫 접속시 아무 데이터도 뜨지 않으며 관리자 페이지 진입시 
관리자 비밀 번호 생성 (기본 0000)
기타 탭, firebase 콘솔 상에서 변경 가능
</pre>

###7) 파일 업로드
<pre>
firebase 의 db 상에는 파일의 이름만 올라가고 파일 자체는 awsS3 에 올라간다.
js/init.js 파일에 입력한다.
AWS.config.update() > accessKeyId, secretAccessKey 
new AWS.S3() > bucket,  region
해당 key값의 입력이 필요하다.
</pre>
