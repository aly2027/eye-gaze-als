/* EYEUM — shared language handling for index.html, privacy.html, disclaimer.html
 *
 * Load this in <head> (no defer) so the language is known before the page paints:
 *   <script src="i18n.js"></script>
 *
 * How a language is chosen, in order:
 *   1. ?lang=ko / ?lang=en in the URL   (use this for links you send to partners)
 *   2. the visitor's previous choice    (saved in localStorage)
 *   3. the browser's own language
 *   4. English
 *
 * Markup contract:
 *   <span data-i18n="key">           text is replaced (HTML allowed in the dictionary)
 *   <button data-lang-btn="ko">      language switch button, gets class "active"
 *   <div class="lang" id="lang-ko">  whole-block swap (used by the legal pages)
 */
(function (global) {
  "use strict";

  var STORE_KEY = "gazespeak-lang";
  var SUPPORTED = ["en", "ko"];
  var listeners = [];
  var current = "en";

  function clean(value) {
    if (!value) return null;
    value = String(value).toLowerCase();
    if (value.indexOf("ko") === 0 || value === "kr") return "ko";
    if (value.indexOf("en") === 0) return "en";
    return null;
  }

  function fromUrl() {
    var match = /[?&]lang=([^&#]+)/.exec(global.location.search);
    return match ? clean(decodeURIComponent(match[1])) : null;
  }

  function fromStore() {
    try { return clean(global.localStorage.getItem(STORE_KEY)); }
    catch (e) { return null; }
  }

  function save(lang) {
    try { global.localStorage.setItem(STORE_KEY, lang); }
    catch (e) { /* private mode — the URL parameter still works */ }
  }

  function detect() {
    return fromUrl() || fromStore() || clean(global.navigator.language) || "en";
  }

  /* ---- dictionary -------------------------------------------------------- */

  var DICT = {
    en: {
      "page.title.index": "EYEUM — Communicate with Your Eyes",
      "page.title.privacy": "Privacy Policy — EYEUM",
      "page.title.disclaimer": "Disclaimer & Terms of Use — EYEUM",

      "nav.features": "Features",
      "nav.how": "How it works",
      "nav.download": "Download",
      "nav.feedback": "Feedback",
      "nav.contact": "Contact",
      "nav.cta": "Get the app",

      "hero.eyebrow": "Eye-gaze communication",
      "hero.h1": "Speak again, <em>with your eyes</em>.",
      "hero.lead": "EYEUM lets people living with ALS speak words using only eye movements — no touch, no controllers, no expensive hardware.",
      "hero.btn.download": "Download the app",
      "hero.btn.how": "See how it works",
      "hero.note": "Free · Works on a standard tablet or smartphone camera · No account required",

      "mock.cam.t": "Front Camera Preview",
      "mock.cam.s": "Press Start to begin eye tracking",
      "mock.start": "Start",
      "mock.pause": "Pause",
      "mock.stop": "Stop",
      "mock.main": "Main",
      "mock.w0": "Can't breathe",
      "mock.w1": "Suction",
      "mock.w00": "Yes",
      "mock.w01": "No",
      "mock.w10": "Repeat",
      "mock.w11": "Wait",
      "mock.w000": "Thirsty",
      "mock.w011": "Uncomfortable",
      "mock.w100": "\u2192 PAIN",
      "mock.w111": "\u2192 FEELING",

      "feat.eyebrow": "Powerful, simple",
      "feat.h2": "Low-cost communication that asks the least of the patient.",
      "feat.p": "EYEUM pairs camera-based eye tracking with a board where the words you use most are always the fastest to reach.",
      "feat.1.h": "Camera-based eye tracking",
      "feat.1.p": "Uses the front camera of a standard phone or tablet, and only left and right eye movements. No headset, no infrared rig, no calibration lab required.",
      "feat.2.h": "Frequency-ordered board",
      "feat.2.p": "The words and phrases you use most sit within the fewest glances, so everyday communication comes out faster.",
      "feat.3.h": "Speaks out loud",
      "feat.3.p": "Each completed word is read aloud with built-in text-to-speech, so caregivers hear it instantly.",
      "feat.4.h": "Made for real use",
      "feat.4.p": "Large targets, high-contrast text, and quick caregiver phrases designed with accessibility first — not as an afterthought.",

      "how.eyebrow": "How it works",
      "how.h2": "From a short code to a spoken word.",
      "how.1.h": "Read the word's code",
      "how.1.p": "Every word on the board carries a short binary code — 0 for a glance left, 1 for a glance right. The patient finds the word they want and reads its code.",
      "how.2.h": "Build the code with left and right",
      "how.2.p": "A glance to the left adds a 0, a glance to the right adds a 1. Each digit appears on screen as it is entered, so the code can be followed as it forms.",
      "how.3.h": "Hold the center to speak",
      "how.3.p": "Gazing at the center for about two seconds completes the code. If it matches a word in the book, the app speaks it aloud through the device speaker.",

      "dl.eyebrow": "Get the app",
      "dl.h2": "Download EYEUM",
      "dl.sub": "Free for individuals, families, and care organizations. We ask only who you are — everything else is optional.",
      "dl.copy": "EYEUM runs on a standard Android tablet or phone. Confirm the notice below to get the download links, a quick-start guide, and the full manual.",
      "dl.li1": "Free forever for personal and clinical use",
      "dl.li2": "Includes a quick-start guide and a full manual (English · 한국어)",
      "dl.li3": "No name or contact details needed — just tell us which group you belong to",
      "routes.h": "Two ways to get it",
      "routes.lead": "EYEUM is not publicly listed on Google Play yet, so there are two routes.",
      "routes.a.name": "Get it now",
      "routes.a.body": "Download the installation file straight from this site. There's no waiting, but while it installs Android will ask you a few times whether you're sure. Just follow the screens.",
      "routes.b.name": "Get it through Google Play",
      "routes.b.body": "Leave a Gmail address in the form and we'll send you an invitation. It takes a few days, but then it installs just like any other app and new versions arrive on their own.",
      "routes.note": "The two are treated as separate apps, so only one can be installed at a time. To switch, remove the one you have first.",
      "dl.li4": "The camera is used only on your device — nothing is uploaded",
      "dl.li5": "All we ask in return: tell us how it went once you've tried it",

      "form.h3": "Get the app",
      "form.sub": "Only the fields marked <span class=\"req\">*</span> need to be filled in or chosen.",
      "form.email": "Email <span class=\"req\">*</span>",
      "form.route": "How would you like to get it <span class=\"req\">*</span>",
      "form.route.now": "File from this site, no waiting",
      "form.route.play": "Invitation by email, a few days",
      "form.routeError": "Please choose how you'd like to get it.",
      "form.emailError": "Please enter the Gmail address you use on your phone.",
      "play.h3": "Your request is in",
      "play.sub": "We'll email an invitation link within a few days. Open it on the phone or tablet signed in with that address, and the app installs from Google Play as usual.",
      "play.guides": "You can read the guides while you wait.",
      "form.role": "I'm downloading as <span class=\"req\">*</span>",
      "form.roleError": "Please choose one so we know who EYEUM is reaching.",
      "role.choose": "Please choose one",
      "role.patient": "Person living with ALS/MND",
      "role.family": "Family member or caregiver",
      "role.clinician": "Clinician or therapist",
      "role.clinic": "Clinic",
      "role.hospital": "Hospital",
      "role.org": "ALS organization / nonprofit",
      "role.researcher": "Researcher",
      "role.individual": "Individual",
      "role.other": "Other",
      "consent.privacy": "If I entered any details above, I agree the EYEUM team may use them to provide support and occasional updates. I can ask to be removed at any time. <a href=\"privacy.html\" target=\"_blank\" rel=\"noopener\">Privacy Policy</a>",
      "consent.disclaimer": "<strong><span class=\"req\">*</span> Required:</strong> I understand EYEUM is a communication aid, not a medical device, and must not be relied on alone in emergencies or for life-critical communication. <a href=\"disclaimer.html\" target=\"_blank\" rel=\"noopener\">Read the full disclaimer</a>",

      "pledge.h4": "One small favour",
      "pledge.p": "EYEUM is a research project, and it improves only when people tell us how it went. Please use it for a week or two with the person you're supporting, then come back to this site and leave your notes. What didn't work matters most.",
      "pledge.where": "The feedback form lives at the <strong>bottom of this page</strong>, under <strong>\"Already tried EYEUM?\"</strong> — or use the <strong>Feedback</strong> link in the top menu whenever you return.",
      "pledge.consent": "Yes — I'll come back and share how it went.",
      "form.submit": "Continue",

      "success.h3": "You're all set",
      "success.sub": "Choose your device below. The guides are underneath.",
      "dl.android": "Android phone or tablet",
      "dl.ios": "iPhone or iPad",
      "dl.iosSoon": "iPhone or iPad — coming soon",
      "dl.sep": "User manual",
      "dl.reminder": "Reminder: keep a reliable backup way to call for help. EYEUM should not be your only means of communication in an emergency.",
      "install.title": "If install is blocked or you see a warning — step by step",
      "install.lead": "When you install the file (APK), Android shows a few confirmation screens along the way. They don't mean anything is wrong with the app — Android shows them for any file that did not come from the Play Store.",
      "install.s1": "Tap <strong>Download</strong>.",
      "install.s2": "Tap <strong>Settings</strong>.",
      "install.s3": "Turn on <strong>Allow permission</strong>, then go back.",
      "install.s4": "Tap the <strong>left button</strong>. The one on the right cancels the install.",
      "install.s5": "Tap <strong>Install</strong>.",
      "install.s6": "That's it. Tap <strong>Open</strong> to start.",
      "install.note": "Depending on the device, the order may differ slightly, or Google Play Protect may offer to scan the app first. Let it scan and carry on.",
      "install.after": "Once it is installed you can turn <strong>Allow permission</strong> back off. EYEUM will keep working.",
      "install.contact": "Still stuck? Email contact.eyeum@gmail.com and tell us which device you are using.",
      "install.tech": "For IT and hospital administrators",
      "install.tech.src": "Published from: github.com/aly2027/eye-gaze-als",
      "install.tech.file": "File: <code>EYEUM.apk</code> \u00b7 version 1.3.2",
      "install.tech.pkg": "Package: <code>org.eyeum.app</code>",

      "fb.eyebrow": "Your experience matters",
      "fb.h2": "Already tried EYEUM?",
      "fb.p": "We're building this with the ALS community, not just for it. If you'd like to share how it went — what worked, what didn't, what would help — we'd be grateful. It's completely optional.",
      "fb.btn": "Share your feedback",

      "foot.tagline": "Restoring voice and independence for people living with ALS through accessible eye-gaze communication.",
      "foot.product": "Product",
      "foot.contact": "Get in touch",
      "foot.privacy": "Privacy Policy",
      "foot.disclaimer": "Disclaimer",
      "foot.copyright": "© 2026 EYEUM. Built for those finding their voice.",
      "foot.made": "Made with care by the EYEUM research team.",

      "legal.back": "← Back to site",
      "legal.eyebrow": "Legal",
      "legal.updated": "Last updated: ",
      "legal.privacy.h1": "Privacy Policy",
      "legal.disclaimer.h1": "Disclaimer & Terms of Use",
      "legal.footer": "EYEUM — Eye-gaze communication for people with ALS."
    },

    ko: {
      "page.title.index": "EYEUM — 눈으로 말하다",
      "page.title.privacy": "개인정보처리방침 — EYEUM",
      "page.title.disclaimer": "고지사항 및 이용약관 — EYEUM",

      "nav.features": "주요 기능",
      "nav.how": "사용 방법",
      "nav.download": "다운로드",
      "nav.feedback": "피드백",
      "nav.contact": "문의",
      "nav.cta": "앱 받기",

      "hero.eyebrow": "눈으로 하는 의사소통",
      "hero.h1": "눈으로<br><em>다시 말해보세요</em>.",
      "hero.lead": "말하기가 힘들고 몸을 움직이기 힘든 ALS(루게릭병) 환자분이 눈의 움직임만으로 하고 싶은 말을 전할 수 있습니다. 화면을 만질 필요도, 비싼 장비를 살 필요도 없습니다. 스마트폰이나 태블릿만 있으면 앱을 내려받아 바로 쓰실 수 있습니다.",
      "hero.btn.download": "앱 다운로드",
      "hero.btn.how": "사용 방법 보기",
      "hero.note": "무료 · 일반 태블릿이나 스마트폰 카메라로 작동 · 계정 불필요",

      "mock.cam.t": "전면 카메라 미리보기",
      "mock.cam.s": "시작을 눌러 시선 추적을 시작하세요",
      "mock.start": "시작",
      "mock.pause": "일시정지",
      "mock.stop": "정지",
      "mock.main": "메인",
      "mock.w0": "숨막혀",
      "mock.w1": "썩션",
      "mock.w00": "예",
      "mock.w01": "아니오",
      "mock.w10": "다시해요",
      "mock.w11": "기다려요",
      "mock.w000": "목말라요",
      "mock.w011": "불편해",
      "mock.w100": "\u2192 통증",
      "mock.w111": "\u2192 감정",

      "feat.eyebrow": "단순하지만 강력합니다",
      "feat.h2": "눈으로 대화할 때 환자분의 피로를 최소화하도록 설계했습니다.",
      "feat.p": "카메라로 시선을 읽고, 자주 쓰는 말일수록 더 빨리 고를 수 있도록 단어판을 배치했습니다.",
      "feat.1.h": "카메라만으로 시선을 읽습니다",
      "feat.1.p": "스마트폰이나 태블릿의 전면 카메라를 그대로 씁니다. 눈을 왼쪽이나 오른쪽으로 움직이기만 하면 되고, 헤드셋이나 적외선 장비, 복잡한 보정 과정은 필요하지 않습니다.",
      "feat.2.h": "자주 쓰는 말이 가장 가까이",
      "feat.2.p": "많이 쓰는 말일수록 더 적은 눈 움직임으로 고를 수 있게 설계했습니다. 급하고 꼭 필요한 말을 더 빨리 전하실 수 있습니다.",
      "feat.3.h": "소리 내어 읽어줍니다",
      "feat.3.p": "단어를 고르면 기기가 바로 소리 내어 읽어줍니다. 곁에 계신 보호자가 즉시 알아들을 수 있습니다.",
      "feat.4.h": "실제 병상에서 쓸 수 있게",
      "feat.4.p": "글자를 크고 또렷하게 키웠고, 보호자에게 자주 하시는 말을 미리 담았습니다. 처음부터 환자분이 쓰실 것을 생각하며 만들었습니다.",

      "how.eyebrow": "사용 방법",
      "how.h2": "눈동자를 좌우로 움직여서 코드를 만들면 목소리가 됩니다.",
      "how.1.h": "코드 확인하기",
      "how.1.p": "화면의 단어마다 0과 1로 된 짧은 코드가 붙어 있습니다. 왼쪽을 보면 0, 오른쪽을 보면 1입니다. 하고 싶은 말을 찾아 그 코드를 눈으로 확인합니다.",
      "how.2.h": "좌우로 코드 만들기",
      "how.2.p": "왼쪽을 보면 0이, 오른쪽을 보면 1이 하나씩 입력됩니다. 입력되는 숫자가 화면에 바로 나타나기 때문에 지금까지 무엇을 골랐는지 확인하며 진행할 수 있습니다.",
      "how.3.h": "가운데 보며 말하기",
      "how.3.p": "가운데를 2초쯤 바라보면 코드가 완성됩니다. 단어판에 있는 말이면 그대로 소리가 나오고, 없는 코드라면 저절로 지워져 다시 시작할 수 있습니다.",

      "dl.eyebrow": "앱 받기",
      "dl.h2": "EYEUM 다운로드",
      "dl.sub": "환자분과 가족, 돌봄 기관 모두 무료로 쓰실 수 있습니다. 어떤 분이신지 한 가지만 골라주시면 되고, 나머지는 선택입니다.",
      "dl.copy": "가지고 계신 안드로이드 태블릿이나 스마트폰에서 바로 쓰실 수 있습니다. 아래 내용을 확인해 주시면 앱과 함께 사용 설명서를 받으실 수 있습니다.",
      "dl.li1": "개인이든 병원이든 계속 무료입니다",
      "dl.li2": "빠른 시작 안내와 전체 설명서를 함께 드립니다 (한국어 · English)",
      "dl.li3": "이름이나 연락처는 적지 않으셔도 됩니다 — 어떤 분이신지만 골라주세요",
      "routes.h": "받으시는 방법은 두 가지입니다",
      "routes.lead": "EYEUM은 아직 구글 플레이에 정식 공개되기 전이라, 두 가지 경로가 있습니다.",
      "routes.a.name": "바로 받기",
      "routes.a.body": "이 사이트에서 설치 파일을 직접 받습니다. 기다릴 필요가 없지만, 설치할 때 안드로이드가 \"이 파일을 설치하시겠습니까\" 하고 몇 번 물어봅니다. 화면을 따라 하시면 됩니다.",
      "routes.b.name": "구글 플레이로 받기",
      "routes.b.body": "신청란에 Gmail 주소를 남겨주시면 초대를 보내드립니다. 며칠 걸리지만, 평소 앱 받으시는 것과 똑같이 설치되고 새 버전도 저절로 업데이트됩니다.",
      "routes.note": "두 방식은 서로 다른 앱이라 한 기기에 하나만 설치할 수 있습니다. 바꾸시려면 쓰고 계신 것을 먼저 지워주세요.",
      "dl.li4": "카메라 영상은 기기 밖으로 나가지 않습니다",
      "dl.li5": "한 가지만 부탁드립니다 — 써보신 뒤 어떠셨는지 알려주세요",

      "form.h3": "앱 받기",
      "form.sub": "<span class=\"req\">*</span> 표시된 항목만 고르거나 확인해 주시면 됩니다.",
      "form.email": "이메일 <span class=\"req\">*</span>",
      "form.route": "어떻게 받으시겠습니까 <span class=\"req\">*</span>",
      "form.route.now": "이 사이트에서 파일로, 기다림 없이",
      "form.route.play": "이메일로 초대, 며칠 소요",
      "form.routeError": "어떻게 받으실지 골라주세요.",
      "form.emailError": "휴대폰에서 쓰시는 Gmail 주소를 적어주세요.",
      "play.h3": "신청이 접수되었습니다",
      "play.sub": "며칠 안에 초대 링크를 메일로 보내드립니다. 그 주소로 로그인된 휴대폰이나 태블릿에서 링크를 여시면, 평소처럼 구글 플레이에서 앱이 설치됩니다.",
      "play.guides": "기다리시는 동안 설명서를 먼저 보실 수 있습니다.",
      "form.role": "어떤 분이신가요 <span class=\"req\">*</span>",
      "form.roleError": "EYEUM이 어떤 분들께 닿고 있는지 알 수 있도록 한 가지만 골라주세요.",
      "role.choose": "선택해 주세요",
      "role.patient": "ALS(루게릭병) 환자 본인",
      "role.family": "가족 또는 보호자",
      "role.clinician": "의료진 또는 치료사",
      "role.clinic": "의원 · 클리닉",
      "role.hospital": "병원",
      "role.org": "ALS 관련 단체 / 비영리기관",
      "role.researcher": "연구자",
      "role.individual": "개인",
      "role.other": "기타",
      "consent.privacy": "위 항목을 입력한 경우, EYEUM 팀이 지원 및 소식 안내를 위해 이를 사용하는 데 동의합니다. 언제든지 삭제를 요청할 수 있습니다. <a href=\"privacy.html\" target=\"_blank\" rel=\"noopener\">개인정보처리방침</a>",
      "consent.disclaimer": "<strong><span class=\"req\">*</span> 필수:</strong> EYEUM은 의료기기가 아닌 보조 의사소통 도구이며, 응급 상황이나 생명과 직결된 의사소통에서 이 앱에만 의존해서는 안 된다는 점을 이해합니다. <a href=\"disclaimer.html\" target=\"_blank\" rel=\"noopener\">전체 고지사항 읽기</a>",

      "pledge.h4": "한 가지 부탁드립니다",
      "pledge.p": "EYEUM은 아직 연구 중인 도구입니다. 실제로 써보신 분들의 이야기가 있어야 더 나아질 수 있습니다. 환자분과 함께 1~2주쯤 써보신 뒤 이 사이트에 다시 들러 이야기를 남겨주세요. 잘 안 됐던 점을 알려주시는 것이 가장 큰 도움이 됩니다.",
      "pledge.where": "이야기를 남기는 곳은 <strong>이 페이지 맨 아래</strong> <strong>“EYEUM을 사용해 보셨나요?”</strong> 부분입니다. 다시 오실 때는 맨 위 메뉴의 <strong>피드백</strong>을 누르셔도 됩니다.",
      "pledge.consent": "네, 써본 뒤에 다시 들러 이야기를 남기겠습니다.",
      "form.submit": "계속하기",

      "success.h3": "준비되었습니다",
      "success.sub": "쓰시는 기기를 고르세요. 설명서는 아래에 있습니다.",
      "dl.android": "안드로이드 휴대폰 또는 태블릿",
      "dl.ios": "아이폰 또는 아이패드",
      "dl.iosSoon": "아이폰 또는 아이패드 — 준비 중",
      "dl.sep": "사용 설명서",
      "dl.reminder": "도움을 요청할 다른 방법을 꼭 함께 준비해 주세요. 급한 상황에서 EYEUM 하나에만 기대서는 안 됩니다.",
      "install.title": "설치가 안 되거나 경고가 나올 때 — 화면으로 따라하기",
      "install.lead": "파일(APK)로 설치하실 때는 설치 중에 확인 화면이 몇 번 나타납니다. 앱에 문제가 있다는 뜻이 아니라, 스토어 밖에서 받은 파일일 때 안드로이드가 늘 보여주는 화면입니다.",
      "install.s1": "<strong>다운로드</strong>를 누릅니다.",
      "install.s2": "<strong>설정</strong>을 누릅니다.",
      "install.s3": "<strong>권한 허용</strong> 스위치를 켜고 뒤로 갑니다.",
      "install.s4": "<strong>왼쪽 버튼</strong>을 누릅니다. 오른쪽을 누르면 설치가 취소됩니다.",
      "install.s5": "<strong>설치</strong>를 누릅니다.",
      "install.s6": "설치가 끝났습니다. <strong>열기</strong>를 누르면 시작합니다.",
      "install.note": "기기와 설정에 따라 화면 순서가 조금 다르거나, 중간에 구글 Play 프로텍트의 앱 검사 화면이 추가로 나올 수 있습니다. 검사를 진행하시면 됩니다.",
      "install.after": "설치가 끝난 뒤에는 <strong>권한 허용</strong>을 다시 꿐두셔도 됩니다. EYEUM 사용에는 영향이 없습니다.",
      "install.contact": "그래도 설치되지 않으면 contact.eyeum@gmail.com 으로 기기 이름과 함께 알려주세요.",
      "install.tech": "기관·병원 담당자용 확인 정보",
      "install.tech.src": "배포처: github.com/aly2027/eye-gaze-als",
      "install.tech.file": "파일: <code>EYEUM.apk</code> \u00b7 버전 1.3.2",
      "install.tech.pkg": "패키지: <code>org.eyeum.app</code>",

      "fb.eyebrow": "써보신 이야기를 들려주세요",
      "fb.h2": "EYEUM을 사용해 보셨나요?",
      "fb.p": "이 앱은 ALS 환자분과 곁에서 돌보시는 분들의 이야기를 들으며 조금씩 나아지고 있습니다. 무엇이 편했고 무엇이 불편했는지, 어떤 기능이 있으면 좋겠는지 알려주시면 큰 힘이 됩니다. 물론 남기지 않으셔도 괜찮습니다.",
      "fb.btn": "이야기 남기기",

      "foot.tagline": "누구나 쓸 수 있는 시선 의사소통으로, ALS 환자분들이 목소리와 일상을 되찾으시도록 돕습니다.",
      "foot.product": "바로가기",
      "foot.contact": "연락처",
      "foot.privacy": "개인정보처리방침",
      "foot.disclaimer": "고지사항",
      "foot.copyright": "© 2026 EYEUM. 목소리를 찾는 모든 분들을 위해.",
      "foot.made": "EYEUM 연구팀이 정성을 담아 만들었습니다.",

      "legal.back": "← 사이트로 돌아가기",
      "legal.eyebrow": "법적 고지",
      "legal.updated": "최종 수정일: ",
      "legal.privacy.h1": "개인정보처리방침",
      "legal.disclaimer.h1": "고지사항 및 이용약관",
      "legal.footer": "EYEUM — ALS 환자분을 위한 시선 의사소통 도구."
    }
  };

  /* ---- applying a language ----------------------------------------------- */

  function translate(lang) {
    var table = DICT[lang] || DICT.en;
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute("data-i18n");
      if (table[key] != null) { nodes[i].innerHTML = table[key]; }
    }
    var titleKey = document.body ? document.body.getAttribute("data-title-key") : null;
    if (titleKey && table[titleKey]) { document.title = table[titleKey]; }
  }

  // The legal pages keep two full copies of the text and show one at a time.
  function swapBlocks(lang) {
    var blocks = document.querySelectorAll(".lang");
    for (var i = 0; i < blocks.length; i++) {
      var isMatch = blocks[i].id === "lang-" + lang;
      if (isMatch) { blocks[i].classList.add("show"); }
      else { blocks[i].classList.remove("show"); }
    }
  }

  function markButtons(lang) {
    var btns = document.querySelectorAll("[data-lang-btn]");
    for (var i = 0; i < btns.length; i++) {
      var on = btns[i].getAttribute("data-lang-btn") === lang;
      if (on) { btns[i].classList.add("active"); }
      else { btns[i].classList.remove("active"); }
      btns[i].setAttribute("aria-pressed", on ? "true" : "false");
    }
  }

  // Carry the language across to the other pages of the site.
  function tagInternalLinks(lang) {
    var links = document.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href");
      if (!href) continue;
      if (href.charAt(0) === "#" || /^(mailto:|tel:|https?:)/i.test(href)) continue;
      if (!/\.html(\?|#|$)/i.test(href)) continue;   // leave PDFs and files alone
      var base = href.split("#")[0].split("?")[0];
      var hash = href.indexOf("#") > -1 ? href.slice(href.indexOf("#")) : "";
      links[i].setAttribute("href", base + "?lang=" + lang + hash);
    }
  }

  function reveal() {
    if (document.documentElement) { document.documentElement.classList.add("i18n-ready"); }
  }

  function markRoot(lang) {
    var root = document.documentElement;
    if (!root) return;                    // document not built yet
    root.lang = lang;
    root.setAttribute("data-lang", lang);
  }

  // Install-guide screenshots come in a Korean set and an English set.
  function swapInstallShots(lang) {
    var shots = document.querySelectorAll(".install-shot");
    for (var i = 0; i < shots.length; i++) {
      var src = shots[i].getAttribute("src");
      if (!src) continue;
      shots[i].setAttribute("src", src.replace(/\/(ko|en)-(\d+)\.jpg/, "/" + lang + "-$2.jpg"));
    }
  }

  function apply(lang) {
    current = lang;
    markRoot(lang);
    if (!document.body) return;           // called too early; DOMContentLoaded will redo it
    translate(lang);
    swapInstallShots(lang);
    swapBlocks(lang);
    markButtons(lang);
    tagInternalLinks(lang);
    reveal();
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](lang); } catch (e) { /* one bad listener shouldn't stop the rest */ }
    }
  }

  function set(lang) {
    lang = clean(lang) || "en";
    save(lang);
    apply(lang);
  }

  /* ---- boot -------------------------------------------------------------- */

  // Runs while <head> is parsing: sets the attribute before anything is painted,
  // so CSS can hide the wrong-language content without a flash.
  current = detect();
  markRoot(current);

  // Safety net: if anything below fails, the page still becomes visible.
  global.setTimeout(reveal, 1200);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { apply(current); });
  } else {
    apply(current);
  }

  global.GSI18N = {
    get: function () { return current; },
    set: set,
    supported: SUPPORTED,
    dict: DICT,
    onChange: function (fn) { if (typeof fn === "function") { listeners.push(fn); } }
  };

  // Keeps the legal pages' existing inline onclick="setLang('ko')" working.
  global.setLang = set;
})(window);
