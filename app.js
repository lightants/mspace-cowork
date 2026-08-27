(function () {
  const OPEN = 9 * 60;
  const CLOSE = 18 * 60;
  const STEP = 30;
  const DESK_RATE = 50;

  const pad = (n) => String(n).padStart(2, "0");
  const minutesToValue = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
  const valueToMinutes = (v) => {
    const [h, min] = (v || "0:0").split(":").map(Number);
    return h * 60 + min;
  };
  const formatClock = (v) => {
    const m = valueToMinutes(v);
    const h24 = Math.floor(m / 60);
    const min = m % 60;
    const am = h24 < 12;
    const h12 = h24 % 12 || 12;
    return `${h12}:${pad(min)} ${am ? "AM" : "PM"}`;
  };
  const peso = (n) => {
    const rounded = Math.round(n * 100) / 100;
    const body = Number.isInteger(rounded)
      ? String(rounded)
      : rounded.toFixed(2);
    return `₱${body}`;
  };
  const hoursBetween = (start, end) => (valueToMinutes(end) - valueToMinutes(start)) / 60;
  const todayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };
  const formatDate = (iso) => {
    if (!iso) return "—";
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-PH", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const fillTimeSelect = (el, from, to, selected) => {
    if (!el) return;
    const keep = selected || el.value;
    el.innerHTML = "";
    for (let m = from; m <= to; m += STEP) {
      const opt = document.createElement("option");
      opt.value = minutesToValue(m);
      opt.textContent = formatClock(opt.value);
      el.appendChild(opt);
    }
    if ([...el.options].some((o) => o.value === keep)) el.value = keep;
  };

  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  const requireContact = (mobile, email) => {
    if ((mobile || "").trim() || (email || "").trim()) return "";
    return "Leave a mobile number or an email so we can reach you.";
  };

  /* Desk booking */
  const deskForm = document.getElementById("desk-form");
  if (deskForm) {
    const dateEl = document.getElementById("desk-date");
    const roleEl = document.getElementById("desk-role");
    const startEl = document.getElementById("desk-start");
    const endEl = document.getElementById("desk-end");
    const noteEl = document.getElementById("desk-discount-note");
    const errEl = document.getElementById("desk-error");
    dateEl.min = todayISO();
    fillTimeSelect(startEl, OPEN, CLOSE - STEP, "09:00");
    fillTimeSelect(endEl, OPEN + STEP, CLOSE, "10:00");

    const discounted = () => {
      const v = roleEl.value;
      return v === "student" || v === "teacher";
    };

    const quote = () => {
      noteEl.classList.toggle("on", discounted());
      const hrs = hoursBetween(startEl.value, endEl.value);
      const valid = hrs > 0;
      const sub = valid ? hrs * DESK_RATE : 0;
      const off = discounted() && valid ? sub * 0.1 : 0;
      const total = sub - off;
      document.getElementById("r-hours").textContent = valid
        ? (Number.isInteger(hrs) ? `${hrs}` : hrs.toFixed(1)) + (hrs === 1 ? " hour" : " hours")
        : "—";
      document.getElementById("r-sub").textContent = valid ? peso(sub) : "—";
      document.getElementById("r-off").textContent = discounted()
        ? valid
          ? `−${peso(off)}`
          : "10% will apply"
        : "Not applied";
      document.getElementById("r-total").textContent = valid ? peso(total) : "₱0";
      return { hrs, sub, off, total, valid };
    };

    const syncEnd = () => {
      const minEnd = valueToMinutes(startEl.value) + STEP;
      fillTimeSelect(endEl, minEnd, CLOSE, endEl.value);
      if (valueToMinutes(endEl.value) <= valueToMinutes(startEl.value)) {
        endEl.value = minutesToValue(Math.min(CLOSE, minEnd));
      }
      quote();
    };

    ["change", "input"].forEach((ev) => {
      deskForm.addEventListener(ev, quote);
    });
    startEl.addEventListener("change", syncEnd);
    quote();

    deskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = quote();
      const name = document.getElementById("desk-name").value.trim();
      const contactErr = requireContact(
        document.getElementById("desk-mobile").value,
        document.getElementById("desk-email").value
      );
      let msg = "";
      if (!dateEl.value) msg = "Pick a date.";
      else if (!roleEl.value) msg = "Select your role.";
      else if (!q.valid) msg = "End time must be after start time, within 9:00 AM–6:00 PM.";
      else if (!name) msg = "Add your name.";
      else if (contactErr) msg = contactErr;
      if (msg) {
        errEl.hidden = false;
        errEl.textContent = msg;
        errEl.focus?.();
        return;
      }
      errEl.hidden = true;
      const roleLabel = roleEl.options[roleEl.selectedIndex].text;
      const mobile = document.getElementById("desk-mobile").value.trim();
      const email = document.getElementById("desk-email").value.trim();
      const notes = document.getElementById("desk-notes").value.trim();
      const hrsLabel = (Number.isInteger(q.hrs) ? `${q.hrs}` : q.hrs.toFixed(1)) + (q.hrs === 1 ? " hour" : " hours");
      document.getElementById("desk-due").textContent = peso(q.total);
      document.getElementById("desk-due-note").textContent = q.off
        ? `${hrsLabel} · ₱50/hour with 10% student/teacher off`
        : `${hrsLabel} · ₱50/hour`;
      document.getElementById("desk-summary").innerHTML = `
        <div class="receipt-row"><dt>When</dt><dd>${formatDate(dateEl.value)}, ${formatClock(startEl.value)}–${formatClock(endEl.value)}</dd></div>
        <div class="receipt-row"><dt>Role</dt><dd>${roleLabel}</dd></div>
        <div class="receipt-row"><dt>Hours</dt><dd>${hrsLabel}</dd></div>
        <div class="receipt-row"><dt>Subtotal</dt><dd>${peso(q.sub)}</dd></div>
        <div class="receipt-row"><dt>Discount</dt><dd>${q.off ? "−" + peso(q.off) : "None"}</dd></div>
        <div class="receipt-row"><dt>Amount due</dt><dd>${peso(q.total)}</dd></div>
        <div class="receipt-row"><dt>Pay by</dt><dd>GCash QR — cashless, no cash</dd></div>
        <div class="receipt-row"><dt>Name</dt><dd>${name}</dd></div>
        <div class="receipt-row"><dt>Contact</dt><dd>${[mobile, email].filter(Boolean).join(" · ")}</dd></div>
        ${notes ? `<div class="receipt-row"><dt>Notes</dt><dd>${notes}</dd></div>` : ""}
      `;
      document.getElementById("desk-hero").classList.add("hidden");
      document.getElementById("desk-flow").classList.add("hidden");
      document.getElementById("desk-confirm").classList.add("show");
      document.getElementById("desk-confirm").scrollIntoView({ behavior: "auto", block: "start" });
    });

    if (new URLSearchParams(location.search).get("checkout") === "1") {
      dateEl.value = todayISO();
      roleEl.value = "student";
      document.getElementById("desk-name").value = "Preview Guest";
      document.getElementById("desk-email").value = "guest@example.com";
      quote();
      deskForm.requestSubmit();
    }
  }

  /* Conference booking */
  const confForm = document.getElementById("conf-form");
  if (confForm) {
    const dateEl = document.getElementById("conf-date");
    const typeEl = document.getElementById("conf-type");
    const startEl = document.getElementById("conf-start");
    const endEl = document.getElementById("conf-end");
    const sizeEl = document.getElementById("conf-size");
    const errEl = document.getElementById("conf-error");
    dateEl.min = todayISO();
    fillTimeSelect(startEl, OPEN, CLOSE - STEP, "09:00");
    fillTimeSelect(endEl, OPEN + STEP, CLOSE, "10:00");

    const paint = () => {
      const hrs = hoursBetween(startEl.value, endEl.value);
      const valid = hrs > 0;
      document.getElementById("c-when").textContent = dateEl.value
        ? `${formatDate(dateEl.value)}, ${formatClock(startEl.value)}–${formatClock(endEl.value)}`
        : "—";
      document.getElementById("c-hours").textContent = valid
        ? (Number.isInteger(hrs) ? `${hrs}` : hrs.toFixed(1)) + (hrs === 1 ? " hour" : " hours")
        : "—";
      const type = typeEl.value ? typeEl.options[typeEl.selectedIndex].text : "—";
      const size = sizeEl.value ? `${sizeEl.value} people` : "";
      document.getElementById("c-type").textContent = [type, size].filter(Boolean).join(" · ") || "—";
      document.getElementById("c-rate").textContent = "TBD";
      return { hrs, valid };
    };

    const syncEnd = () => {
      const minEnd = valueToMinutes(startEl.value) + STEP;
      fillTimeSelect(endEl, minEnd, CLOSE, endEl.value);
      if (valueToMinutes(endEl.value) <= valueToMinutes(startEl.value)) {
        endEl.value = minutesToValue(Math.min(CLOSE, minEnd));
      }
      paint();
    };

    ["change", "input"].forEach((ev) => confForm.addEventListener(ev, paint));
    startEl.addEventListener("change", syncEnd);
    paint();

    confForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = paint();
      const name = document.getElementById("conf-name").value.trim();
      const contactErr = requireContact(
        document.getElementById("conf-mobile").value,
        document.getElementById("conf-email").value
      );
      const size = Number(sizeEl.value);
      let msg = "";
      if (!dateEl.value) msg = "Pick a date.";
      else if (!typeEl.value) msg = "Choose a meeting type.";
      else if (!q.valid) msg = "End time must be after start time, within 9:00 AM–6:00 PM.";
      else if (!size || size < 1) msg = "Add party size.";
      else if (!name) msg = "Add your name.";
      else if (contactErr) msg = contactErr;
      if (msg) {
        errEl.hidden = false;
        errEl.textContent = msg;
        return;
      }
      errEl.hidden = true;
      const mobile = document.getElementById("conf-mobile").value.trim();
      const email = document.getElementById("conf-email").value.trim();
      const notes = document.getElementById("conf-notes").value.trim();
      document.getElementById("conf-summary").innerHTML = `
        <div class="receipt-row"><dt>When</dt><dd>${formatDate(dateEl.value)}, ${formatClock(startEl.value)}–${formatClock(endEl.value)}</dd></div>
        <div class="receipt-row"><dt>Duration</dt><dd>${q.hrs} hour${q.hrs === 1 ? "" : "s"}</dd></div>
        <div class="receipt-row"><dt>Type</dt><dd>${typeEl.options[typeEl.selectedIndex].text}</dd></div>
        <div class="receipt-row"><dt>Party size</dt><dd>${size}</dd></div>
        <div class="receipt-row"><dt>Rate</dt><dd>TBD — we’ll confirm</dd></div>
        <div class="receipt-row"><dt>Pay by</dt><dd>GCash QR — cashless, no cash</dd></div>
        <div class="receipt-row"><dt>Name</dt><dd>${name}</dd></div>
        <div class="receipt-row"><dt>Contact</dt><dd>${[mobile, email].filter(Boolean).join(" · ")}</dd></div>
        ${notes ? `<div class="receipt-row"><dt>Notes</dt><dd>${notes}</dd></div>` : ""}
      `;
      document.getElementById("conf-hero").classList.add("hidden");
      document.getElementById("conf-flow").classList.add("hidden");
      document.getElementById("conf-confirm").classList.add("show");
      document.getElementById("conf-confirm").scrollIntoView({ behavior: "auto", block: "start" });
    });

    if (new URLSearchParams(location.search).get("checkout") === "1") {
      dateEl.value = todayISO();
      typeEl.value = "team";
      sizeEl.value = "4";
      document.getElementById("conf-name").value = "Preview Guest";
      document.getElementById("conf-email").value = "guest@example.com";
      paint();
      confForm.requestSubmit();
    }
  }
})();
