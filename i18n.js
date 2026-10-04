/* EYEUM — shared language handling for index.html, privacy.html, disclaimer.html
 *
 * Load this in <head> (no defer) so the language is known before the page paints:
 *   <script src="i18n.js"></script>
 *
 * How a language is chosen, in order:
 *   1. ?lang=en / ko / es / pt / fr in the URL   (use this for links you send to partners)
 *   2. the visitor's previous choice    (saved in localStorage)
 *   3. the browser's own language
 *   4. English
 *
 * Markup contract:
 *   <span data-i18n="key">           text is replaced (HTML allowed in the dictionary)
 *   <button data-lang-btn="ko">      language switch button, gets class "active"
 *   <select data-lang-select>         language drop-down, its value follows the language
 *   <div class="lang" id="lang-ko">  whole-block swap (used by the legal pages)
 */
(function (global) {
  "use strict";

  var STORE_KEY = "gazespeak-lang";
  var SUPPORTED = ["en", "ko", "es", "pt", "fr"];   // to add a language: add it here and to DICT below
  var listeners = [];
  var current = "en";

  function clean(value) {
    if (!value) return null;
    value = String(value).toLowerCase();
    if (value === "kr") return "ko";
    // "es-MX", "es-419", "pt_BR" ... -> the two-letter language part
    var base = value.split(/[-_]/)[0];
    return SUPPORTED.indexOf(base) > -1 ? base : null;
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
      "page.title.index": "EYEUM (눈빛이음) — Talk with Your Eyes",
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
      "feat.4.p": "Text sized to fill the screen, a voice-guided practice mode for first-time users, and quick caregiver phrases — designed with accessibility first, not as an afterthought.",

      "how.eyebrow": "How it works",
      "how.h2": "From a short code to a spoken word.",
      "how.1.h": "Read the word's code",
      "how.1.p": "Every word on the board carries a short binary code — 0 for a glance left, 1 for a glance right. The patient finds the word they want and reads its code.",
      "how.2.h": "Build the code with left and right",
      "how.2.p": "A glance to the left adds a 0, a glance to the right adds a 1. Each digit appears on screen as it is entered, so the code can be followed as it forms.",
      "how.3.h": "Hold the center to speak",
      "how.3.p": "Gazing at the center for a few seconds (3 by default, adjustable from 2 to 5) completes the code. If it matches a word in the book, the app speaks it aloud through the device speaker.",

      "dl.eyebrow": "Get the app",
      "dl.h2": "Download EYEUM",
      "dl.sub": "Free for individuals, families, and care organizations. Just choose how you'd like to get it and who you are. An email address is needed only for the Google Play route, so we can send the invitation.",
      "dl.copy": "EYEUM runs on a standard Android tablet or phone. Confirm the notice below to get the download links, a quick-start guide, and the full manual.",
      "dl.li1": "Free forever for personal and clinical use",
      "dl.li2": "Includes a quick-start guide and a full manual (English · 한국어 · Español · Português · Français)",
      "dl.li3": "No name needed — an email address only if you choose Google Play",
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
      "install.tech.file": "File: <code>EYEUM.apk</code> \u00b7 version 1.4.0",
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
      "page.title.index": "EYEUM 눈빛이음 — 눈으로 말하다",
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
      "feat.4.p": "글자를 화면에 맞춰 크고 또렷하게 보여 드리고, 처음 쓰시는 분을 위한 음성 안내 연습 모드와 보호자에게 자주 하시는 말을 미리 담았습니다. 처음부터 환자분이 쓰실 것을 생각하며 만들었습니다.",

      "how.eyebrow": "사용 방법",
      "how.h2": "눈동자를 좌우로 움직여서 코드를 만들면 목소리가 됩니다.",
      "how.1.h": "코드 확인하기",
      "how.1.p": "화면의 단어마다 0과 1로 된 짧은 코드가 붙어 있습니다. 왼쪽을 보면 0, 오른쪽을 보면 1입니다. 하고 싶은 말을 찾아 그 코드를 눈으로 확인합니다.",
      "how.2.h": "좌우로 코드 만들기",
      "how.2.p": "왼쪽을 보면 0이, 오른쪽을 보면 1이 하나씩 입력됩니다. 입력되는 숫자가 화면에 바로 나타나기 때문에 지금까지 무엇을 골랐는지 확인하며 진행할 수 있습니다.",
      "how.3.h": "가운데 보며 말하기",
      "how.3.p": "가운데를 잠시(기본 3초, 설정에서 2~5초로 조절) 바라보면 코드가 완성됩니다. 단어판에 있는 말이면 그대로 소리가 나오고, 없는 코드라면 저절로 지워져 다시 시작할 수 있습니다.",

      "dl.eyebrow": "앱 받기",
      "dl.h2": "EYEUM 다운로드",
      "dl.sub": "환자분과 가족, 돌봄 기관 모두 무료로 쓰실 수 있습니다. 받는 방법과 어떤 분이신지만 골라주시면 됩니다. 이메일은 구글 플레이로 받으실 때 초대를 보내 드리기 위해서만 필요합니다.",
      "dl.copy": "가지고 계신 안드로이드 태블릿이나 스마트폰에서 바로 쓰실 수 있습니다. 아래 내용을 확인해 주시면 앱과 함께 사용 설명서를 받으실 수 있습니다.",
      "dl.li1": "개인이든 병원이든 계속 무료입니다",
      "dl.li2": "빠른 시작 안내와 전체 설명서를 함께 드립니다 (한국어 · English · Español · Português · Français)",
      "dl.li3": "이름은 적지 않으셔도 됩니다 — 이메일은 구글 플레이로 받으실 때만 필요합니다",
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
      "install.tech.file": "파일: <code>EYEUM.apk</code> \u00b7 버전 1.4.0",
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
    },

    es: {
      "page.title.index": "EYEUM (눈빛이음) — Habla con tus ojos",
      "page.title.privacy": "Política de privacidad — EYEUM",
      "page.title.disclaimer": "Aviso legal y condiciones de uso — EYEUM",

      "nav.features": "Funciones",
      "nav.how": "Cómo funciona",
      "nav.download": "Descargar",
      "nav.feedback": "Opiniones",
      "nav.contact": "Contacto",
      "nav.cta": "Descargar",

      "hero.eyebrow": "Comunicación con la mirada",
      "hero.h1": "Vuelve a hablar, <em>con los ojos</em>.",
      "hero.lead": "EYEUM permite que las personas con ELA digan palabras solo con los movimientos de los ojos, sin tocar la pantalla, sin mandos y sin equipos costosos.",
      "hero.btn.download": "Descargar la app",
      "hero.btn.how": "Ver cómo funciona",
      "hero.note": "Gratis · Funciona con la cámara de una tableta o un teléfono normal · No necesita cuenta",

      "mock.cam.t": "Vista previa de la cámara frontal",
      "mock.cam.s": "Pulse Iniciar para comenzar el seguimiento ocular",
      "mock.start": "Iniciar",
      "mock.pause": "Pausa",
      "mock.stop": "Detener",
      "mock.main": "Inicio",
      "mock.w0": "No puedo respirar",
      "mock.w1": "Aspiración",
      "mock.w00": "Sí",
      "mock.w01": "No",
      "mock.w10": "Otra vez",
      "mock.w11": "Espera",
      "mock.w000": "Tengo sed",
      "mock.w011": "Algo me molesta",
      "mock.w100": "\u2192 DOLOR",
      "mock.w111": "\u2192 SENTIMIENTOS",

      "feat.eyebrow": "Potente y sencilla",
      "feat.h2": "Comunicación de bajo costo que exige lo mínimo al paciente.",
      "feat.p": "EYEUM combina el seguimiento ocular con la cámara y un tablero en el que las palabras que más usa siempre son las más rápidas de elegir.",
      "feat.1.h": "Seguimiento ocular con la cámara",
      "feat.1.p": "Usa la cámara frontal de un teléfono o una tableta normal y solo los movimientos de los ojos a izquierda y derecha. Sin casco, sin equipo infrarrojo y sin laboratorio de calibración.",
      "feat.2.h": "Tablero ordenado por frecuencia",
      "feat.2.p": "Las palabras y frases que más usa están a menos miradas de distancia, así la comunicación diaria es más rápida.",
      "feat.3.h": "Habla en voz alta",
      "feat.3.p": "Cada palabra completada se lee en voz alta con la síntesis de voz del dispositivo, así los cuidadores la oyen al instante.",
      "feat.4.h": "Pensada para el uso real",
      "feat.4.p": "Texto grande que llena la pantalla, un modo de práctica guiado por voz para quienes empiezan y frases rápidas para el cuidador: diseñada pensando primero en la accesibilidad.",

      "how.eyebrow": "Cómo funciona",
      "how.h2": "De un código corto a una palabra hablada.",
      "how.1.h": "Lea el código de la palabra",
      "how.1.p": "Cada palabra del tablero tiene un código binario corto: 0 para una mirada a la izquierda y 1 para una mirada a la derecha. El paciente busca la palabra que quiere y lee su código.",
      "how.2.h": "Forme el código mirando a izquierda y derecha",
      "how.2.p": "Una mirada a la izquierda añade un 0 y una mirada a la derecha añade un 1. Cada dígito aparece en pantalla al introducirlo, así se puede seguir el código mientras se forma.",
      "how.3.h": "Mire al centro para hablar",
      "how.3.p": "Mirar al centro unos segundos (3 por defecto, ajustable de 2 a 5) completa el código. Si corresponde a una palabra del diccionario, la app la dice en voz alta por el altavoz del dispositivo.",

      "dl.eyebrow": "Obtener la app",
      "dl.h2": "Descargar EYEUM",
      "dl.sub": "Gratis para personas, familias y organizaciones de cuidado. Solo elija cómo quiere obtenerla y quién es usted. El correo electrónico solo se necesita para la vía de Google Play, para poder enviarle la invitación.",
      "dl.copy": "EYEUM funciona en una tableta o un teléfono Android normal. Confirme el aviso de abajo para obtener los enlaces de descarga, una guía de inicio rápido y el manual completo.",
      "dl.li1": "Gratis para siempre, para uso personal y clínico",
      "dl.li2": "Incluye una guía de inicio rápido y un manual completo (English · 한국어 · Español · Português · Français)",
      "dl.li3": "No hace falta su nombre; solo un correo electrónico si elige Google Play",
      "routes.h": "Dos formas de obtenerla",
      "routes.lead": "EYEUM todavía no está publicada en Google Play para todos, así que hay dos vías.",
      "routes.a.name": "Obtenerla ahora",
      "routes.a.body": "Descargue el archivo de instalación directamente desde este sitio. No hay espera, pero durante la instalación Android le preguntará varias veces si está seguro. Solo siga las pantallas.",
      "routes.b.name": "Obtenerla por Google Play",
      "routes.b.body": "Deje una dirección de Gmail en el formulario y le enviaremos una invitación. Tarda unos días, pero después se instala como cualquier otra app y las nuevas versiones llegan solas.",
      "routes.note": "Las dos se tratan como apps distintas, así que solo puede tener una instalada a la vez. Para cambiar, desinstale primero la que tiene.",
      "dl.li4": "La cámara se usa solo en su dispositivo; no se sube nada",
      "dl.li5": "Lo único que le pedimos: cuéntenos cómo le fue después de probarla",

      "form.h3": "Obtener la app",
      "form.sub": "Solo hay que completar o elegir los campos marcados con <span class=\"req\">*</span>.",
      "form.email": "Correo electrónico <span class=\"req\">*</span>",
      "form.route": "¿Cómo quiere obtenerla? <span class=\"req\">*</span>",
      "form.route.now": "Archivo desde este sitio, sin espera",
      "form.route.play": "Invitación por correo, unos días",
      "form.routeError": "Elija cómo quiere obtenerla.",
      "form.emailError": "Escriba la dirección de Gmail que usa en su teléfono.",
      "play.h3": "Hemos recibido su solicitud",
      "play.sub": "En unos días le enviaremos por correo un enlace de invitación. Ábralo en el teléfono o la tableta con esa cuenta y la app se instalará desde Google Play como siempre.",
      "play.guides": "Mientras tanto, puede leer las guías.",
      "form.role": "Descargo la app como <span class=\"req\">*</span>",
      "form.roleError": "Elija una opción para saber a quién llega EYEUM.",
      "role.choose": "Elija una opción",
      "role.patient": "Persona con ELA / EMN",
      "role.family": "Familiar o cuidador",
      "role.clinician": "Profesional clínico o terapeuta",
      "role.clinic": "Clínica",
      "role.hospital": "Hospital",
      "role.org": "Organización de ELA / sin fines de lucro",
      "role.researcher": "Investigador",
      "role.individual": "Particular",
      "role.other": "Otro",
      "consent.privacy": "Si escribí algún dato arriba, acepto que el equipo de EYEUM lo use para darme soporte y enviarme novedades ocasionales. Puedo pedir que lo borren en cualquier momento. <a href=\"privacy.html\" target=\"_blank\" rel=\"noopener\">Política de privacidad</a>",
      "consent.disclaimer": "<strong><span class=\"req\">*</span> Obligatorio:</strong> Entiendo que EYEUM es una ayuda para la comunicación, no un dispositivo médico, y que no debe ser el único medio en emergencias ni en comunicaciones vitales. <a href=\"disclaimer.html\" target=\"_blank\" rel=\"noopener\">Leer el aviso completo</a>",

      "pledge.h4": "Un pequeño favor",
      "pledge.p": "EYEUM es un proyecto de investigación y solo mejora cuando las personas nos cuentan cómo les fue. Úsela durante una o dos semanas con la persona a la que acompaña, y luego vuelva a este sitio y déjenos sus comentarios. Lo que no funcionó es lo más importante.",
      "pledge.where": "El formulario de opiniones está al <strong>final de esta página</strong>, en <strong>«¿Ya probó EYEUM?»</strong>, o use el enlace <strong>Opiniones</strong> del menú superior cuando vuelva.",
      "pledge.consent": "Sí, volveré para contar cómo nos fue.",
      "form.submit": "Continuar",

      "success.h3": "Todo listo",
      "success.sub": "Elija su dispositivo abajo. Las guías están debajo.",
      "dl.android": "Teléfono o tableta Android",
      "dl.ios": "iPhone o iPad",
      "dl.iosSoon": "iPhone o iPad — próximamente",
      "dl.sep": "Manual del usuario",
      "dl.reminder": "Recuerde: tenga siempre otra forma fiable de pedir ayuda. EYEUM no debe ser su único medio de comunicación en una emergencia.",
      "install.title": "Si la instalación se bloquea o aparece una advertencia: paso a paso",
      "install.lead": "Al instalar el archivo (APK), Android muestra algunas pantallas de confirmación. No significan que la app tenga ningún problema: Android las muestra para cualquier archivo que no venga de Play Store.",
      "install.s1": "Toque <strong>Descargar</strong>.",
      "install.s2": "Toque <strong>Ajustes</strong>.",
      "install.s3": "Active <strong>Permitir permiso</strong> (o «Permitir desde esta fuente») y vuelva atrás.",
      "install.s4": "Toque el <strong>botón de la izquierda</strong>. El de la derecha cancela la instalación.",
      "install.s5": "Toque <strong>Instalar</strong>.",
      "install.s6": "Listo. Toque <strong>Abrir</strong> para empezar.",
      "install.note": "Según el dispositivo, el orden puede variar un poco, o Google Play Protect puede ofrecer analizar la app primero. Deje que la analice y continúe.",
      "install.after": "Una vez instalada, puede volver a desactivar <strong>Permitir permiso</strong>. EYEUM seguirá funcionando.",
      "install.contact": "¿Sigue sin poder? Escriba a contact.eyeum@gmail.com e indíquenos qué dispositivo usa.",
      "install.tech": "Para administradores de TI y de hospitales",
      "install.tech.src": "Publicado desde: github.com/aly2027/eye-gaze-als",
      "install.tech.file": "Archivo: <code>EYEUM.apk</code> \u00b7 versión 1.4.0",
      "install.tech.pkg": "Paquete: <code>org.eyeum.app</code>",

      "fb.eyebrow": "Su experiencia importa",
      "fb.h2": "¿Ya probó EYEUM?",
      "fb.p": "La estamos construyendo con la comunidad de ELA, no solo para ella. Si quiere contarnos cómo le fue (qué funcionó, qué no y qué le ayudaría), se lo agradeceremos mucho. Es totalmente opcional.",
      "fb.btn": "Enviar su opinión",

      "foot.tagline": "Devolvemos la voz y la autonomía a las personas con ELA con una comunicación accesible por la mirada.",
      "foot.product": "Producto",
      "foot.contact": "Contacto",
      "foot.privacy": "Política de privacidad",
      "foot.disclaimer": "Aviso legal",
      "foot.copyright": "© 2026 EYEUM. Para quienes buscan su voz.",
      "foot.made": "Hecho con cariño por el equipo de investigación de EYEUM.",

      "legal.back": "← Volver al sitio",
      "legal.eyebrow": "Legal",
      "legal.updated": "Última actualización: ",
      "legal.privacy.h1": "Política de privacidad",
      "legal.disclaimer.h1": "Aviso legal y condiciones de uso",
      "legal.footer": "EYEUM — Comunicación con la mirada para personas con ELA."
    },

    pt: {
      "page.title.index": "EYEUM (눈빛이음) — Fale com os olhos",
      "page.title.privacy": "Política de privacidade — EYEUM",
      "page.title.disclaimer": "Aviso legal e termos de uso — EYEUM",
      "nav.features": "Recursos",
      "nav.how": "Como funciona",
      "nav.download": "Baixar",
      "nav.feedback": "Opiniões",
      "nav.contact": "Contato",
      "nav.cta": "Baixar",
      "hero.eyebrow": "Comunicação pelo olhar",
      "hero.h1": "Volte a falar, <em>com os olhos</em>.",
      "hero.lead": "O EYEUM permite que pessoas com ELA digam palavras só com os movimentos dos olhos, sem tocar na tela, sem controles e sem equipamentos caros.",
      "hero.btn.download": "Baixar o aplicativo",
      "hero.btn.how": "Ver como funciona",
      "hero.note": "Gratuito · Funciona com a câmera de um tablet ou celular comum · Não precisa de conta",
      "mock.cam.t": "Prévia da câmera frontal",
      "mock.cam.s": "Toque em Iniciar para começar o rastreamento ocular",
      "mock.start": "Iniciar",
      "mock.pause": "Pausar",
      "mock.stop": "Parar",
      "mock.main": "Início",
      "mock.w0": "Falta de ar",
      "mock.w1": "Aspiração",
      "mock.w00": "Sim",
      "mock.w01": "Não",
      "mock.w10": "De novo",
      "mock.w11": "Espera",
      "mock.w000": "Estou com sede",
      "mock.w011": "Algo me incomoda",
      "mock.w100": "→ DOR",
      "mock.w111": "→ SENTIMENTOS",
      "feat.eyebrow": "Poderoso e simples",
      "feat.h2": "Comunicação de baixo custo que exige o mínimo do paciente.",
      "feat.p": "O EYEUM combina rastreamento ocular pela câmera com um quadro em que as palavras que você mais usa são sempre as mais rápidas de escolher.",
      "feat.1.h": "Rastreamento ocular pela câmera",
      "feat.1.p": "Usa a câmera frontal de um celular ou tablet comum e apenas os movimentos dos olhos para a esquerda e para a direita. Sem capacete, sem equipamento infravermelho, sem laboratório de calibração.",
      "feat.2.h": "Quadro ordenado por frequência",
      "feat.2.p": "As palavras e frases que você mais usa ficam a menos olhares de distância, então a comunicação do dia a dia sai mais rápido.",
      "feat.3.h": "Fala em voz alta",
      "feat.3.p": "Cada palavra completa é lida em voz alta pela síntese de voz do aparelho, e os cuidadores a ouvem na hora.",
      "feat.4.h": "Feito para o uso real",
      "feat.4.p": "Texto grande que ocupa a tela, um modo de prática guiado por voz para quem está começando e frases rápidas para o cuidador: projetado pensando primeiro em acessibilidade.",
      "how.eyebrow": "Como funciona",
      "how.h2": "De um código curto a uma palavra falada.",
      "how.1.h": "Leia o código da palavra",
      "how.1.p": "Cada palavra do quadro tem um código binário curto: 0 para um olhar à esquerda e 1 para um olhar à direita. O paciente encontra a palavra que quer e lê o seu código.",
      "how.2.h": "Forme o código olhando para a esquerda e a direita",
      "how.2.p": "Um olhar à esquerda acrescenta um 0 e um olhar à direita acrescenta um 1. Cada dígito aparece na tela ao ser digitado, então dá para acompanhar o código enquanto ele se forma.",
      "how.3.h": "Olhe para o centro para falar",
      "how.3.p": "Olhar para o centro por alguns segundos (3 por padrão, ajustável de 2 a 5) completa o código. Se ele corresponder a uma palavra do dicionário, o aplicativo a fala em voz alta pelo alto-falante do aparelho.",
      "dl.eyebrow": "Obter o aplicativo",
      "dl.h2": "Baixar o EYEUM",
      "dl.sub": "Gratuito para pessoas, famílias e organizações de cuidado. Basta escolher como quer recebê-lo e quem você é. O e-mail só é necessário pelo caminho do Google Play, para podermos enviar o convite.",
      "dl.copy": "O EYEUM funciona em um tablet ou celular Android comum. Confirme o aviso abaixo para receber os links de download, um guia de início rápido e o manual completo.",
      "dl.li1": "Gratuito para sempre, para uso pessoal e clínico",
      "dl.li2": "Inclui um guia de início rápido e um manual completo (English · 한국어 · Español · Português · Français)",
      "dl.li3": "Não precisa do seu nome; só um e-mail se você escolher o Google Play",
      "routes.h": "Duas formas de obter",
      "routes.lead": "O EYEUM ainda não está publicado para todos no Google Play, então há dois caminhos.",
      "routes.a.name": "Obter agora",
      "routes.a.body": "Baixe o arquivo de instalação direto deste site. Não há espera, mas durante a instalação o Android vai perguntar algumas vezes se você tem certeza. É só seguir as telas.",
      "routes.b.name": "Obter pelo Google Play",
      "routes.b.body": "Deixe um endereço do Gmail no formulário e enviaremos um convite. Leva alguns dias, mas depois ele é instalado como qualquer outro aplicativo e as novas versões chegam sozinhas.",
      "routes.note": "Os dois são tratados como aplicativos diferentes, então só um pode ficar instalado por vez. Para trocar, desinstale primeiro o que você tem.",
      "dl.li4": "A câmera é usada só no seu aparelho; nada é enviado",
      "dl.li5": "Só pedimos uma coisa: conte como foi depois de experimentar",
      "form.h3": "Obter o aplicativo",
      "form.sub": "Só é preciso preencher ou escolher os campos marcados com <span class=\"req\">*</span>.",
      "form.email": "E-mail <span class=\"req\">*</span>",
      "form.route": "Como você quer receber <span class=\"req\">*</span>",
      "form.route.now": "Arquivo deste site, sem espera",
      "form.route.play": "Convite por e-mail, alguns dias",
      "form.routeError": "Escolha como você quer receber.",
      "form.emailError": "Digite o endereço do Gmail que você usa no celular.",
      "play.h3": "Recebemos seu pedido",
      "play.sub": "Em alguns dias enviaremos por e-mail um link de convite. Abra-o no celular ou tablet conectado a essa conta, e o aplicativo será instalado pelo Google Play normalmente.",
      "play.guides": "Enquanto isso, você pode ler os guias.",
      "form.role": "Estou baixando como <span class=\"req\">*</span>",
      "form.roleError": "Escolha uma opção para sabermos a quem o EYEUM está chegando.",
      "role.choose": "Escolha uma opção",
      "role.patient": "Pessoa com ELA / DNM",
      "role.family": "Familiar ou cuidador",
      "role.clinician": "Profissional clínico ou terapeuta",
      "role.clinic": "Clínica",
      "role.hospital": "Hospital",
      "role.org": "Organização de ELA / sem fins lucrativos",
      "role.researcher": "Pesquisador",
      "role.individual": "Pessoa física",
      "role.other": "Outro",
      "consent.privacy": "Se preenchi algum dado acima, concordo que a equipe do EYEUM o use para dar suporte e enviar novidades ocasionais. Posso pedir a remoção a qualquer momento. <a href=\"privacy.html\" target=\"_blank\" rel=\"noopener\">Política de privacidade</a>",
      "consent.disclaimer": "<strong><span class=\"req\">*</span> Obrigatório:</strong> Entendo que o EYEUM é uma ajuda para a comunicação, não um dispositivo médico, e que não deve ser o único meio em emergências nem em comunicações vitais. <a href=\"disclaimer.html\" target=\"_blank\" rel=\"noopener\">Ler o aviso completo</a>",
      "pledge.h4": "Um pequeno favor",
      "pledge.p": "O EYEUM é um projeto de pesquisa e só melhora quando as pessoas contam como foi. Use-o por uma ou duas semanas com a pessoa que você acompanha e depois volte a este site para deixar seus comentários. O que não funcionou é o mais importante.",
      "pledge.where": "O formulário de opiniões fica no <strong>fim desta página</strong>, em <strong>«Já experimentou o EYEUM?»</strong>, ou use o link <strong>Opiniões</strong> no menu de cima quando voltar.",
      "pledge.consent": "Sim, vou voltar para contar como foi.",
      "form.submit": "Continuar",
      "success.h3": "Tudo pronto",
      "success.sub": "Escolha seu aparelho abaixo. Os guias estão logo depois.",
      "dl.android": "Celular ou tablet Android",
      "dl.ios": "iPhone ou iPad",
      "dl.iosSoon": "iPhone ou iPad — em breve",
      "dl.sep": "Manual do usuário",
      "dl.reminder": "Lembre-se: tenha sempre outra forma confiável de pedir ajuda. O EYEUM não deve ser seu único meio de comunicação numa emergência.",
      "install.title": "Se a instalação for bloqueada ou aparecer um aviso: passo a passo",
      "install.lead": "Ao instalar o arquivo (APK), o Android mostra algumas telas de confirmação. Elas não significam que haja algo errado com o aplicativo: o Android as mostra para qualquer arquivo que não venha da Play Store.",
      "install.s1": "Toque em <strong>Baixar</strong>.",
      "install.s2": "Toque em <strong>Configurações</strong>.",
      "install.s3": "Ative <strong>Permitir desta fonte</strong> (ou «Permitir permissão») e volte.",
      "install.s4": "Toque no <strong>botão da esquerda</strong>. O da direita cancela a instalação.",
      "install.s5": "Toque em <strong>Instalar</strong>.",
      "install.s6": "Pronto. Toque em <strong>Abrir</strong> para começar.",
      "install.note": "Dependendo do aparelho, a ordem pode mudar um pouco, ou o Google Play Protect pode oferecer verificar o aplicativo antes. Deixe verificar e continue.",
      "install.after": "Depois de instalado, você pode desativar <strong>Permitir desta fonte</strong> de novo. O EYEUM continuará funcionando.",
      "install.contact": "Ainda com problemas? Escreva para contact.eyeum@gmail.com e diga qual aparelho você usa.",
      "install.tech": "Para administradores de TI e de hospitais",
      "install.tech.src": "Publicado em: github.com/aly2027/eye-gaze-als",
      "install.tech.file": "Arquivo: <code>EYEUM.apk</code> · versão 1.4.0",
      "install.tech.pkg": "Pacote: <code>org.eyeum.app</code>",
      "fb.eyebrow": "Sua experiência importa",
      "fb.h2": "Já experimentou o EYEUM?",
      "fb.p": "Estamos construindo isto com a comunidade de ELA, não apenas para ela. Se quiser contar como foi (o que funcionou, o que não funcionou e o que ajudaria), ficaremos muito gratos. É totalmente opcional.",
      "fb.btn": "Enviar sua opinião",
      "foot.tagline": "Devolvemos a voz e a autonomia às pessoas com ELA com uma comunicação acessível pelo olhar.",
      "foot.product": "Produto",
      "foot.contact": "Contato",
      "foot.privacy": "Política de privacidade",
      "foot.disclaimer": "Aviso legal",
      "foot.copyright": "© 2026 EYEUM. Para quem busca a sua voz.",
      "foot.made": "Feito com carinho pela equipe de pesquisa do EYEUM.",
      "legal.back": "← Voltar ao site",
      "legal.eyebrow": "Legal",
      "legal.updated": "Última atualização: ",
      "legal.privacy.h1": "Política de privacidade",
      "legal.disclaimer.h1": "Aviso legal e termos de uso",
      "legal.footer": "EYEUM — Comunicação pelo olhar para pessoas com ELA."
    },

    fr: {
      "page.title.index": "EYEUM (눈빛이음) — Parlez avec vos yeux",
      "page.title.privacy": "Politique de confidentialité — EYEUM",
      "page.title.disclaimer": "Avertissement et conditions d'utilisation — EYEUM",
      "nav.features": "Fonctions",
      "nav.how": "Fonctionnement",
      "nav.download": "Télécharger",
      "nav.feedback": "Avis",
      "nav.contact": "Contact",
      "nav.cta": "Obtenir",
      "hero.eyebrow": "Communication par le regard",
      "hero.h1": "Parlez à nouveau, <em>avec vos yeux</em>.",
      "hero.lead": "EYEUM permet aux personnes atteintes de SLA de dire des mots uniquement avec les mouvements des yeux, sans toucher l'écran, sans manette et sans matériel coûteux.",
      "hero.btn.download": "Télécharger l'application",
      "hero.btn.how": "Voir le fonctionnement",
      "hero.note": "Gratuit · Fonctionne avec la caméra d'une tablette ou d'un téléphone ordinaire · Sans compte",
      "mock.cam.t": "Aperçu de la caméra avant",
      "mock.cam.s": "Appuyez sur Démarrer pour lancer le suivi du regard",
      "mock.start": "Démarrer",
      "mock.pause": "Pause",
      "mock.stop": "Arrêter",
      "mock.main": "Accueil",
      "mock.w0": "Je ne respire pas",
      "mock.w1": "Aspiration",
      "mock.w00": "Oui",
      "mock.w01": "Non",
      "mock.w10": "Encore",
      "mock.w11": "Attendez",
      "mock.w000": "J'ai soif",
      "mock.w011": "Ça me gêne",
      "mock.w100": "→ DOULEUR",
      "mock.w111": "→ ÉMOTIONS",
      "feat.eyebrow": "Puissant et simple",
      "feat.h2": "Une communication peu coûteuse qui demande le moins d'effort au patient.",
      "feat.p": "EYEUM associe le suivi du regard par la caméra à un tableau où les mots que vous utilisez le plus sont toujours les plus rapides à atteindre.",
      "feat.1.h": "Suivi du regard par la caméra",
      "feat.1.p": "Utilise la caméra avant d'un téléphone ou d'une tablette ordinaire et uniquement les mouvements des yeux vers la gauche et la droite. Sans casque, sans dispositif infrarouge, sans laboratoire de calibrage.",
      "feat.2.h": "Tableau classé par fréquence",
      "feat.2.p": "Les mots et phrases que vous utilisez le plus sont à portée du moins de regards possible, pour une communication quotidienne plus rapide.",
      "feat.3.h": "Parle à voix haute",
      "feat.3.p": "Chaque mot terminé est lu à voix haute par la synthèse vocale de l'appareil, et les aidants l'entendent aussitôt.",
      "feat.4.h": "Pensé pour l'usage réel",
      "feat.4.p": "Un texte qui remplit l'écran, un mode d'entraînement guidé par la voix pour les débutants et des phrases rapides pour l'aidant : l'accessibilité d'abord, pas après coup.",
      "how.eyebrow": "Fonctionnement",
      "how.h2": "D'un code court à un mot prononcé.",
      "how.1.h": "Lisez le code du mot",
      "how.1.p": "Chaque mot du tableau porte un code binaire court : 0 pour un regard à gauche, 1 pour un regard à droite. Le patient trouve le mot voulu et lit son code.",
      "how.2.h": "Formez le code à gauche et à droite",
      "how.2.p": "Un regard à gauche ajoute un 0, un regard à droite ajoute un 1. Chaque chiffre s'affiche à l'écran dès qu'il est saisi, ce qui permet de suivre le code pendant qu'il se forme.",
      "how.3.h": "Regardez le centre pour parler",
      "how.3.p": "Regarder le centre quelques secondes (3 par défaut, réglable de 2 à 5) termine le code. S'il correspond à un mot du dictionnaire, l'application le prononce à voix haute par le haut-parleur de l'appareil.",
      "dl.eyebrow": "Obtenir l'application",
      "dl.h2": "Télécharger EYEUM",
      "dl.sub": "Gratuit pour les particuliers, les familles et les structures de soins. Choisissez simplement comment l'obtenir et qui vous êtes. L'adresse e-mail n'est nécessaire que pour la voie Google Play, afin de vous envoyer l'invitation.",
      "dl.copy": "EYEUM fonctionne sur une tablette ou un téléphone Android ordinaire. Confirmez l'avis ci-dessous pour obtenir les liens de téléchargement, un guide de démarrage rapide et le manuel complet.",
      "dl.li1": "Gratuit pour toujours, pour un usage personnel et clinique",
      "dl.li2": "Comprend un guide de démarrage rapide et un manuel complet (English · 한국어 · Español · Português · Français)",
      "dl.li3": "Pas besoin de votre nom ; seulement une adresse e-mail si vous choisissez Google Play",
      "routes.h": "Deux façons de l'obtenir",
      "routes.lead": "EYEUM n'est pas encore publié pour tous sur Google Play ; il y a donc deux voies.",
      "routes.a.name": "L'obtenir maintenant",
      "routes.a.body": "Téléchargez le fichier d'installation directement sur ce site. Pas d'attente, mais pendant l'installation Android vous demandera plusieurs fois si vous êtes sûr. Suivez simplement les écrans.",
      "routes.b.name": "L'obtenir par Google Play",
      "routes.b.body": "Laissez une adresse Gmail dans le formulaire et nous vous enverrons une invitation. Cela prend quelques jours, mais l'application s'installe ensuite comme les autres et les nouvelles versions arrivent automatiquement.",
      "routes.note": "Les deux sont considérées comme des applications différentes : une seule peut être installée à la fois. Pour changer, désinstallez d'abord celle que vous avez.",
      "dl.li4": "La caméra est utilisée uniquement sur votre appareil ; rien n'est envoyé",
      "dl.li5": "Notre seule demande : dites-nous comment cela s'est passé après l'avoir essayée",
      "form.h3": "Obtenir l'application",
      "form.sub": "Seuls les champs marqués <span class=\"req\">*</span> sont à remplir ou à choisir.",
      "form.email": "E-mail <span class=\"req\">*</span>",
      "form.route": "Comment souhaitez-vous l'obtenir <span class=\"req\">*</span>",
      "form.route.now": "Fichier depuis ce site, sans attente",
      "form.route.play": "Invitation par e-mail, quelques jours",
      "form.routeError": "Choisissez comment vous souhaitez l'obtenir.",
      "form.emailError": "Saisissez l'adresse Gmail utilisée sur votre téléphone.",
      "play.h3": "Votre demande est enregistrée",
      "play.sub": "Nous vous enverrons un lien d'invitation par e-mail d'ici quelques jours. Ouvrez-le sur le téléphone ou la tablette connecté à cette adresse, et l'application s'installera depuis Google Play comme d'habitude.",
      "play.guides": "En attendant, vous pouvez lire les guides.",
      "form.role": "Je télécharge en tant que <span class=\"req\">*</span>",
      "form.roleError": "Choisissez une option pour que nous sachions qui EYEUM atteint.",
      "role.choose": "Choisissez une option",
      "role.patient": "Personne atteinte de SLA / MMN",
      "role.family": "Proche ou aidant",
      "role.clinician": "Clinicien ou thérapeute",
      "role.clinic": "Clinique",
      "role.hospital": "Hôpital",
      "role.org": "Association SLA / organisme à but non lucratif",
      "role.researcher": "Chercheur",
      "role.individual": "Particulier",
      "role.other": "Autre",
      "consent.privacy": "Si j'ai saisi des informations ci-dessus, j'accepte que l'équipe EYEUM les utilise pour m'apporter de l'aide et m'envoyer des nouvelles occasionnelles. Je peux demander leur suppression à tout moment. <a href=\"privacy.html\" target=\"_blank\" rel=\"noopener\">Politique de confidentialité</a>",
      "consent.disclaimer": "<strong><span class=\"req\">*</span> Obligatoire :</strong> Je comprends qu'EYEUM est une aide à la communication, pas un dispositif médical, et qu'il ne doit pas être le seul moyen utilisé en cas d'urgence ou pour une communication vitale. <a href=\"disclaimer.html\" target=\"_blank\" rel=\"noopener\">Lire l'avertissement complet</a>",
      "pledge.h4": "Un petit service",
      "pledge.p": "EYEUM est un projet de recherche qui ne progresse que si l'on nous raconte comment cela s'est passé. Utilisez-le une ou deux semaines avec la personne que vous accompagnez, puis revenez sur ce site pour nous laisser vos remarques. Ce qui n'a pas fonctionné compte le plus.",
      "pledge.where": "Le formulaire d'avis se trouve <strong>en bas de cette page</strong>, sous <strong>« Vous avez essayé EYEUM ? »</strong>, ou utilisez le lien <strong>Avis</strong> du menu en haut lorsque vous revenez.",
      "pledge.consent": "Oui, je reviendrai raconter comment cela s'est passé.",
      "form.submit": "Continuer",
      "success.h3": "C'est prêt",
      "success.sub": "Choisissez votre appareil ci-dessous. Les guides se trouvent juste après.",
      "dl.android": "Téléphone ou tablette Android",
      "dl.ios": "iPhone ou iPad",
      "dl.iosSoon": "iPhone ou iPad — bientôt disponible",
      "dl.sep": "Manuel d'utilisation",
      "dl.reminder": "Rappel : gardez toujours un autre moyen fiable d'appeler à l'aide. EYEUM ne doit pas être votre seul moyen de communication en cas d'urgence.",
      "install.title": "Si l'installation est bloquée ou si un avertissement apparaît : pas à pas",
      "install.lead": "Lors de l'installation du fichier (APK), Android affiche quelques écrans de confirmation. Ils ne signifient pas que l'application pose problème : Android les affiche pour tout fichier qui ne vient pas du Play Store.",
      "install.s1": "Appuyez sur <strong>Télécharger</strong>.",
      "install.s2": "Appuyez sur <strong>Paramètres</strong>.",
      "install.s3": "Activez <strong>Autoriser cette source</strong>, puis revenez en arrière.",
      "install.s4": "Appuyez sur le <strong>bouton de gauche</strong>. Celui de droite annule l'installation.",
      "install.s5": "Appuyez sur <strong>Installer</strong>.",
      "install.s6": "C'est fait. Appuyez sur <strong>Ouvrir</strong> pour commencer.",
      "install.note": "Selon l'appareil, l'ordre peut légèrement varier, ou Google Play Protect peut proposer d'analyser l'application d'abord. Laissez-le faire et continuez.",
      "install.after": "Une fois l'installation terminée, vous pouvez désactiver à nouveau <strong>Autoriser cette source</strong>. EYEUM continuera de fonctionner.",
      "install.contact": "Toujours bloqué ? Écrivez à contact.eyeum@gmail.com en indiquant l'appareil utilisé.",
      "install.tech": "Pour les administrateurs informatiques et hospitaliers",
      "install.tech.src": "Publié depuis : github.com/aly2027/eye-gaze-als",
      "install.tech.file": "Fichier : <code>EYEUM.apk</code> · version 1.4.0",
      "install.tech.pkg": "Paquet : <code>org.eyeum.app</code>",
      "fb.eyebrow": "Votre expérience compte",
      "fb.h2": "Vous avez essayé EYEUM ?",
      "fb.p": "Nous construisons ce projet avec la communauté SLA, pas seulement pour elle. Si vous souhaitez nous raconter comment cela s'est passé (ce qui a marché, ce qui n'a pas marché, ce qui aiderait), nous vous en serons reconnaissants. C'est entièrement facultatif.",
      "fb.btn": "Donner votre avis",
      "foot.tagline": "Rendre la parole et l'autonomie aux personnes atteintes de SLA grâce à une communication accessible par le regard.",
      "foot.product": "Produit",
      "foot.contact": "Contact",
      "foot.privacy": "Politique de confidentialité",
      "foot.disclaimer": "Avertissement",
      "foot.copyright": "© 2026 EYEUM. Pour celles et ceux qui retrouvent leur voix.",
      "foot.made": "Réalisé avec soin par l'équipe de recherche EYEUM.",
      "legal.back": "← Retour au site",
      "legal.eyebrow": "Mentions légales",
      "legal.updated": "Dernière mise à jour : ",
      "legal.privacy.h1": "Politique de confidentialité",
      "legal.disclaimer.h1": "Avertissement et conditions d'utilisation",
      "legal.footer": "EYEUM — Communication par le regard pour les personnes atteintes de SLA."
    }
  };

  /* ---- applying a language ----------------------------------------------- */

  function translate(lang) {
    var table = DICT[lang] || DICT.en;
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute("data-i18n");
      // A key missing from a language falls back to English rather than keeping the old text.
      var text = table[key] != null ? table[key] : DICT.en[key];
      if (text != null) { nodes[i].innerHTML = text; }
    }
    var titleKey = document.body ? document.body.getAttribute("data-title-key") : null;
    var title = titleKey ? (table[titleKey] || DICT.en[titleKey]) : null;
    if (title) { document.title = title; }
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
    var selects = document.querySelectorAll("[data-lang-select]");
    for (var j = 0; j < selects.length; j++) {
      if (selects[j].value !== lang) { selects[j].value = lang; }
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
  // Languages without their own set (for now: Spanish) use the English one.
  // When assets/install/es-1.jpg ... are added, put "es" in this list.
  var SHOT_LANGS = ["en", "ko"];
  function swapInstallShots(lang) {
    var shotLang = SHOT_LANGS.indexOf(lang) > -1 ? lang : "en";
    var shots = document.querySelectorAll(".install-shot");
    for (var i = 0; i < shots.length; i++) {
      var src = shots[i].getAttribute("src");
      if (!src) continue;
      shots[i].setAttribute("src", src.replace(/\/([a-z]{2})-(\d+)\.jpg/, "/" + shotLang + "-$2.jpg"));
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
