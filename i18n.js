/* GazeSpeak — shared language handling for index.html, privacy.html, disclaimer.html
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
      "page.title.index": "GazeSpeak — Communicate with Your Eyes",
      "page.title.privacy": "Privacy Policy — GazeSpeak",
      "page.title.disclaimer": "Disclaimer & Terms of Use — GazeSpeak",

      "nav.features": "Features",
      "nav.how": "How it works",
      "nav.download": "Download",
      "nav.feedback": "Feedback",
      "nav.contact": "Contact",
      "nav.cta": "Get the app",

      "hero.eyebrow": "Eye-gaze communication",
      "hero.h1": "Speak again, <em>with your eyes</em>.",
      "hero.lead": "GazeSpeak lets people living with ALS speak phrases using only eye movements — no touch, no controllers, no expensive hardware.",
      "hero.btn.download": "Download the app",
      "hero.btn.how": "See how it works",
      "hero.note": "Free · Works on a standard tablet camera · No account required",

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
      "mock.w000": "Chest pain",
      "mock.w011": "Thank you",
      "mock.w100": "\u2192 PAIN",
      "mock.w111": "\u2192 FEELING",

      "feat.eyebrow": "Powerful, simple",
      "feat.h2": "Communication that works the way you can move.",
      "feat.p": "GazeSpeak pairs camera-based eye tracking with a board where the words you use most are always the fastest to reach.",
      "feat.1.h": "Camera-based eye tracking",
      "feat.1.p": "Uses the front camera of a standard phone or tablet. No headset, no infrared rig, no calibration lab required.",
      "feat.2.h": "Frequency-ordered board",
      "feat.2.p": "The words and phrases you use most sit within the fewest glances, so everyday communication comes out faster.",
      "feat.3.h": "Speaks out loud",
      "feat.3.p": "Finished sentences are read aloud with built-in text-to-speech, in English or Korean, so caregivers hear them instantly.",
      "feat.4.h": "Made for real use",
      "feat.4.p": "Large targets, high-contrast text, and quick caregiver phrases designed with accessibility first — not as an afterthought.",

      "how.eyebrow": "How it works",
      "how.h2": "Three glances from thought to voice.",
      "how.1.h": "Look to select",
      "how.1.p": "Rest your gaze on a zone of the board. GazeSpeak detects where you're looking and highlights it, then confirms with a short dwell.",
      "how.2.h": "Narrow to your phrase",
      "how.2.p": "Each glance moves you closer to the phrase you need. The most-used phrases sit closest, so reaching one takes only a few moves.",
      "how.3.h": "Speak it out",
      "how.3.p": "Once you land on the phrase, a glance plays it aloud — letting you answer, ask, and connect in real time.",

      "dl.eyebrow": "Get the app",
      "dl.h2": "Download GazeSpeak",
      "dl.sub": "Free for individuals, families, and care organizations. The details below are optional — share only what you'd like.",
      "dl.copy": "GazeSpeak runs on a standard Android tablet or phone. Confirm the notice below to get the download links, a quick-start guide, and the full manual.",
      "dl.li1": "Free forever for personal and clinical use",
      "dl.li2": "Includes a quick-start guide and a full manual (English · 한국어)",
      "dl.li3": "Personal details are optional — none are required",
      "dl.li4": "The camera is used only on your device — nothing is uploaded",
      "dl.li5": "All we ask in return: tell us how it went once you've tried it",

      "form.h3": "Get the app",
      "form.sub": "All fields are optional. Just confirm the notice to continue.",
      "form.email": "Email <span class=\"opt\">(optional — for updates)</span>",
      "form.role": "I'm downloading as <span class=\"opt\">(optional)</span>",
      "role.none": "Prefer not to say",
      "role.patient": "Person living with ALS/MND",
      "role.family": "Family member or caregiver",
      "role.clinician": "Clinician or therapist",
      "role.org": "ALS organization / nonprofit",
      "role.researcher": "Researcher",
      "role.other": "Other",
      "consent.privacy": "If I entered any details above, I agree the GazeSpeak team may use them to provide support and occasional updates. I can ask to be removed at any time. <a href=\"privacy.html\" target=\"_blank\" rel=\"noopener\">Privacy Policy</a>",
      "consent.disclaimer": "<strong>Required:</strong> I understand GazeSpeak is a communication aid, not a medical device, and must not be relied on alone in emergencies or for life-critical communication. <a href=\"disclaimer.html\" target=\"_blank\" rel=\"noopener\">Read the full disclaimer</a>",

      "pledge.h4": "One small favour",
      "pledge.p": "GazeSpeak is a research project, and it improves only when people tell us how it went. Please use it for a week or two with the person you're supporting, then come back to this site and leave your notes. What didn't work matters most.",
      "pledge.where": "The feedback form lives at the <strong>bottom of this page</strong>, under <strong>\"Already tried GazeSpeak?\"</strong> — or use the <strong>Feedback</strong> link in the top menu whenever you return.",
      "pledge.consent": "Yes — I'll come back and share how it went.",
      "form.submit": "Continue to download",

      "success.h3": "You're all set",
      "success.sub": "Choose your platform below, then pick the manual in your language.",
      "dl.android": "Android (APK)",
      "dl.ios": "iOS (TestFlight)",
      "dl.sep": "User manual · 사용 설명서",
      "dl.reminder": "Reminder: keep a reliable backup way to call for help. GazeSpeak should not be your only means of communication in an emergency.",

      "fb.eyebrow": "Your experience matters",
      "fb.h2": "Already tried GazeSpeak?",
      "fb.p": "We're building this with the ALS community, not just for it. If you'd like to share how it went — what worked, what didn't, what would help — we'd be grateful. It's completely optional.",
      "fb.btn": "Share your feedback",

      "foot.tagline": "Restoring voice and independence for people living with ALS through accessible eye-gaze communication. A student-led research project.",
      "foot.product": "Product",
      "foot.contact": "Get in touch",
      "foot.privacy": "Privacy Policy",
      "foot.disclaimer": "Disclaimer",
      "foot.copyright": "© 2026 GazeSpeak. Built for those finding their voice.",
      "foot.made": "Made with care by the GazeSpeak research team.",

      "legal.back": "← Back to site",
      "legal.eyebrow": "Legal",
      "legal.updated": "Last updated: ",
      "legal.privacy.h1": "Privacy Policy",
      "legal.disclaimer.h1": "Disclaimer & Terms of Use",
      "legal.footer": "GazeSpeak — Eye-gaze communication for people with ALS."
    },

    ko: {
      "page.title.index": "GazeSpeak — 눈으로 말하다",
      "page.title.privacy": "개인정보처리방침 — GazeSpeak",
      "page.title.disclaimer": "고지사항 및 이용약관 — GazeSpeak",

      "nav.features": "주요 기능",
      "nav.how": "사용 방법",
      "nav.download": "다운로드",
      "nav.feedback": "피드백",
      "nav.contact": "문의",
      "nav.cta": "앱 받기",

      "hero.eyebrow": "시선 응시 의사소통",
      "hero.h1": "다시 말하세요, <em>눈으로</em>.",
      "hero.lead": "GazeSpeak는 ALS(루게릭병) 환자가 눈의 움직임만으로 말할 수 있게 합니다. 터치도, 별도 기기도, 비싼 장비도 필요하지 않습니다.",
      "hero.btn.download": "앱 다운로드",
      "hero.btn.how": "사용 방법 보기",
      "hero.note": "무료 · 일반 태블릿 카메라로 작동 · 계정 불필요",

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
      "mock.w000": "가슴 아파",
      "mock.w011": "고마워",
      "mock.w100": "\u2192 통증",
      "mock.w111": "\u2192 감정",

      "feat.eyebrow": "강력하고 단순하게",
      "feat.h2": "움직일 수 있는 만큼으로 충분한 의사소통.",
      "feat.p": "GazeSpeak는 카메라 기반 시선 추적과 단어판을 결합했습니다. 자주 쓰는 단어일수록 더 적은 시선 움직임으로 닿습니다.",
      "feat.1.h": "카메라 기반 시선 추적",
      "feat.1.p": "일반 스마트폰이나 태블릿의 전면 카메라만 사용합니다. 헤드셋도, 적외선 장비도, 별도의 보정 과정도 필요 없습니다.",
      "feat.2.h": "사용 빈도순 단어판",
      "feat.2.p": "자주 쓰는 단어와 문구일수록 적은 응시 횟수로 선택되도록 배치되어, 일상 대화가 더 빠르게 이어집니다.",
      "feat.3.h": "음성으로 출력",
      "feat.3.p": "선택한 문구는 내장 음성 변환(TTS)으로 한국어 또는 영어로 읽어주어, 보호자가 즉시 들을 수 있습니다.",
      "feat.4.h": "실제 사용을 고려한 설계",
      "feat.4.p": "큰 선택 영역, 높은 명암비의 글자, 보호자에게 자주 하는 말 — 접근성을 나중에 덧붙이지 않고 처음부터 설계했습니다.",

      "how.eyebrow": "사용 방법",
      "how.h2": "세 번의 시선으로 생각에서 목소리까지.",
      "how.1.h": "시선으로 선택",
      "how.1.p": "단어판의 좌우를 응시하면 GazeSpeak가 방향을 인식해 표시하고, 잠시 머무르면 입력이 확정됩니다.",
      "how.2.h": "문구 좁혀가기",
      "how.2.p": "응시할 때마다 원하는 문구에 가까워집니다. 자주 쓰는 문구일수록 가까이 있어 몇 번의 움직임이면 닿습니다.",
      "how.3.h": "소리 내어 말하기",
      "how.3.p": "문구에 도달하면 중앙을 응시하는 것만으로 음성이 나옵니다. 답하고, 묻고, 실시간으로 소통할 수 있습니다.",

      "dl.eyebrow": "앱 받기",
      "dl.h2": "GazeSpeak 다운로드",
      "dl.sub": "개인, 가족, 돌봄 기관 모두 무료로 사용하실 수 있습니다. 아래 항목은 모두 선택 사항이니 원하시는 만큼만 남겨주세요.",
      "dl.copy": "GazeSpeak는 일반 안드로이드 태블릿이나 스마트폰에서 작동합니다. 아래 고지사항에 동의하시면 다운로드 링크와 빠른 시작 안내, 전체 설명서를 받으실 수 있습니다.",
      "dl.li1": "개인 및 임상 목적으로 계속 무료",
      "dl.li2": "빠른 시작 안내와 전체 설명서 포함 (한국어 · English)",
      "dl.li3": "개인 정보 입력은 선택 사항이며, 필수 항목은 없습니다",
      "dl.li4": "카메라는 기기 안에서만 사용되며 외부로 전송되지 않습니다",
      "dl.li5": "한 가지만 부탁드립니다 — 사용해 보신 뒤 어떠셨는지 알려주세요",

      "form.h3": "앱 받기",
      "form.sub": "모든 항목은 선택 사항입니다. 고지사항에만 동의하시면 진행됩니다.",
      "form.email": "이메일 <span class=\"opt\">(선택 — 소식 안내용)</span>",
      "form.role": "어떤 분이신가요 <span class=\"opt\">(선택)</span>",
      "role.none": "밝히지 않음",
      "role.patient": "ALS(루게릭병) 환자 본인",
      "role.family": "가족 또는 보호자",
      "role.clinician": "의료진 또는 치료사",
      "role.org": "ALS 관련 단체 / 비영리기관",
      "role.researcher": "연구자",
      "role.other": "기타",
      "consent.privacy": "위 항목을 입력한 경우, GazeSpeak 팀이 지원 및 소식 안내를 위해 이를 사용하는 데 동의합니다. 언제든지 삭제를 요청할 수 있습니다. <a href=\"privacy.html\" target=\"_blank\" rel=\"noopener\">개인정보처리방침</a>",
      "consent.disclaimer": "<strong>필수:</strong> GazeSpeak는 의료기기가 아닌 보조 의사소통 도구이며, 응급 상황이나 생명과 직결된 의사소통에서 이 앱에만 의존해서는 안 된다는 점을 이해합니다. <a href=\"disclaimer.html\" target=\"_blank\" rel=\"noopener\">전체 고지사항 읽기</a>",

      "pledge.h4": "한 가지 부탁드립니다",
      "pledge.p": "GazeSpeak는 연구 프로젝트입니다. 사용해 보신 분들의 이야기가 있어야 개선할 수 있습니다. 환자분과 함께 1~2주 정도 사용해 보신 뒤, 이 사이트에 다시 방문하여 후기를 남겨주세요. 잘 안 됐던 점이 가장 큰 도움이 됩니다.",
      "pledge.where": "피드백 양식은 <strong>이 페이지 맨 아래</strong> <strong>\"Already tried GazeSpeak?\"</strong> 섹션에 있습니다. 다시 방문하실 때는 상단 메뉴의 <strong>피드백</strong> 링크를 이용하셔도 됩니다.",
      "pledge.consent": "네 — 사용해 본 뒤 다시 방문해 후기를 남기겠습니다.",
      "form.submit": "다운로드로 계속하기",

      "success.h3": "준비되었습니다",
      "success.sub": "아래에서 기기를 선택하신 뒤, 원하시는 언어의 설명서를 받으세요.",
      "dl.android": "안드로이드 (APK)",
      "dl.ios": "iOS (TestFlight)",
      "dl.sep": "사용 설명서 · User manual",
      "dl.reminder": "안내: 도움을 요청할 수 있는 다른 수단을 반드시 함께 준비해 주세요. 응급 상황에서 GazeSpeak가 유일한 의사소통 수단이 되어서는 안 됩니다.",

      "fb.eyebrow": "여러분의 경험이 중요합니다",
      "fb.h2": "GazeSpeak를 사용해 보셨나요?",
      "fb.p": "저희는 ALS 커뮤니티를 위해서가 아니라, 함께 이 도구를 만들고 있습니다. 무엇이 좋았고 무엇이 불편했는지, 무엇이 있으면 좋겠는지 알려주시면 큰 도움이 됩니다. 물론 선택 사항입니다.",
      "fb.btn": "피드백 남기기",

      "foot.tagline": "접근 가능한 시선 응시 의사소통을 통해 ALS 환자분들의 목소리와 자립을 되찾고자 합니다. 학생이 주도하는 연구 프로젝트입니다.",
      "foot.product": "제품",
      "foot.contact": "연락처",
      "foot.privacy": "개인정보처리방침",
      "foot.disclaimer": "고지사항",
      "foot.copyright": "© 2026 GazeSpeak. 목소리를 찾는 모든 분들을 위해.",
      "foot.made": "GazeSpeak 연구팀이 정성을 담아 만들었습니다.",

      "legal.back": "← 사이트로 돌아가기",
      "legal.eyebrow": "법적 고지",
      "legal.updated": "최종 수정일: ",
      "legal.privacy.h1": "개인정보처리방침",
      "legal.disclaimer.h1": "고지사항 및 이용약관",
      "legal.footer": "GazeSpeak — ALS 환자를 위한 시선 응시 의사소통."
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

  function apply(lang) {
    current = lang;
    markRoot(lang);
    if (!document.body) return;           // called too early; DOMContentLoaded will redo it
    translate(lang);
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
