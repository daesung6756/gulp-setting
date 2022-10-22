node -v
v14.18.1  ( 상위 버전 사용시 visual c++ runtime error 발생 )

- 처음 제작시에 package.json을 생성 하기 위해
  npm init -y

npm install gulp -g

npm install gulp --D (--save-dev)

- package.json에 설치 된 모듈이 있을 경우
  npm i


```
gulp (none clean)
```
```
gulp dev (clean develoment)
```
```
gulp build (clean production)
```
------------------------------

1. 폴더 구조

/build
```
├─assets
│  ├─fonts
│  ├─images
│  │    ├─favicons
│  │    └─icons
│  ├─js
│  │   └─vendor
│  └─css
│       └─vendor
└─guide
```
/src
```
├─ assets
│  ├─fonts
│  ├─images
│  │  ├─favicons
│  │  ├─icons
│  │  └─ ...
│  ├─js
│  ├─scss
│  │  ├─components
│  │  └─import
│  ├──sprite
│  └─vendor
│      ├─css
│      └─js
├─pages
│  └─guide
└─templates
      ├─include
      └─macros
```

2. 파일 설명
- .gitignore 깃 이그놀 파일에는 깃 에서 관리 안하겠다고 선언한 파일들이 들어있습니다.
깃 프로젝트가 아니면 삭제하셔도 됩니다.
- gulpfile.js 이것은 걸프사용 js이며, 모든 테스크 규칙을 정의하는 파일입니다.
- package.json 은 npm init 명령어로 생성이 되며, npm 설치 내역과 세부 내용
들이 들어 있습니다.
- server.js 는 express을 통해 가상 웹서버를 구현하는 용도 입니다.

3. Module nunjuck 과 data.json
예) {% set items = ["a", 1, { b : true}] %}
각 페이지에 상단에 json 형태의 데이터를 사용하여 처리 하거나.
data.json으로 처리 하셔도 됩니다.
위의 두 방식 중 편하신걸로 사용하시면 됩니다.

nunjuck 의 명령어와 사용법은 아래 경로에서 확인.
https://mozilla.github.io/nunjucks/templating.html
https://velog.io/@pkbird/Nunjucks-basic