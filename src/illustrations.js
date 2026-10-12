export const collageArt = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240" fill="none" aria-hidden="true" focusable="false">
  <defs>
    <filter id="collage-paper-shadow" x="-25%" y="-25%" width="150%" height="160%" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#373340" flood-opacity=".09"/>
      <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#373340" flood-opacity=".06"/>
    </filter>
  </defs>

  <g transform="translate(28 42) rotate(-6 121 85)" filter="url(#collage-paper-shadow)">
    <rect width="244" height="173" rx="11" fill="#E7DEF6" stroke="#D3C6E9"/>
    <path d="M0 30H244" stroke="#D3C6E9"/>
    <circle cx="17" cy="15" r="3.5" fill="#F29385"/>
    <circle cx="29" cy="15" r="3.5" fill="#E9C367"/>
    <circle cx="41" cy="15" r="3.5" fill="#A5B68A"/>
    <text x="224" y="18" text-anchor="end" fill="#8D7BA7" font-family="system-ui, sans-serif" font-size="8.5" letter-spacing="1.2">IDEAS.JS</text>
    <rect x="12" y="42" width="220" height="117" rx="6" fill="#F8F4FC"/>
    <g font-family="ui-monospace, 'Cascadia Code', Consolas, monospace" font-size="11.5">
      <text x="25" y="65" fill="#9B88B5">// a work in progress</text>
      <text x="25" y="88" fill="#594574"><tspan fill="#8C58B1">const</tspan> idea = {</text>
      <text x="39" y="108" fill="#67567E">curiosity: <tspan fill="#477962">true</tspan>,</text>
      <text x="39" y="128" fill="#67567E">aLittleChaos: <tspan fill="#477962">true</tspan>,</text>
      <text x="25" y="148" fill="#594574">};</text>
    </g>
    <path d="m194 139 5 5 9-11" stroke="#8666AB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <g transform="translate(285 17) rotate(3 115 103)" filter="url(#collage-paper-shadow)">
    <path d="M2 4 228 0 233 198 0 204Z" fill="#F5E8A6" stroke="#E4D798"/>
    <path d="M79 0 141 0 139 16 82 17Z" fill="#FFFDF2" fill-opacity=".48"/>
    <g transform="translate(187 36)" stroke="#3866DF" stroke-width="3.3" stroke-linecap="round">
      <path d="M0-13V13M-12-6.5 12 6.5M-12 6.5 12-6.5"/>
    </g>
    <g fill="#33405B" font-family="Georgia, 'Times New Roman', serif" font-size="37" font-style="italic" letter-spacing="-1.4">
      <text x="24" y="64" transform="rotate(-2 24 64)">make</text>
      <text x="24" y="109" transform="rotate(-1 24 109)">something</text>
      <text x="24" y="154" transform="rotate(-3 24 154)">good.</text>
    </g>
    <path d="M25 167c25-3 53-3 82-1" stroke="#3C69DD" stroke-width="2.5" stroke-linecap="round"/>
    <text x="205" y="184" text-anchor="end" fill="#8B8054" font-family="system-ui, sans-serif" font-size="8" letter-spacing="1.3">NOTE TO SELF</text>
  </g>

  <g transform="translate(540 42) rotate(-4 118 86)" filter="url(#collage-paper-shadow)">
    <rect width="235" height="173" rx="10" fill="#DDECF3" stroke="#C4DAE5"/>
    <rect x="13" y="14" width="209" height="144" rx="7" fill="#F9FCFD"/>
    <path d="M13 42H222" stroke="#DFE8EC"/>
    <circle cx="27" cy="28" r="5" fill="#3265DC"/>
    <path d="M40 28H73M190 28H207" stroke="#A7B8C1" stroke-width="2.5" stroke-linecap="round"/>
    <text x="28" y="65" fill="#344758" font-family="Georgia, 'Times New Roman', serif" font-size="17">little details.</text>
    <path d="M28 77H111M28 84H86" stroke="#D1DCE2" stroke-width="3" stroke-linecap="round"/>
    <rect x="149" y="55" width="56" height="42" rx="5" fill="#EAE3F5"/>
    <circle cx="178" cy="76" r="12" fill="#BFB0DB"/>
    <path d="m153 94 20-20 18 20" fill="#F4E5A6"/>
    <circle cx="37" cy="113" r="10" fill="#AFC6D1"/>
    <circle cx="64" cy="113" r="10" fill="#D7C8EB"/>
    <circle cx="91" cy="113" r="10" fill="#EBC6A8"/>
    <circle cx="118" cy="113" r="10" fill="#B7C49C"/>
    <rect x="27" y="133" width="100" height="15" rx="7.5" fill="#3466DC"/>
    <text x="77" y="143.5" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="8.5">a good start</text>
    <path d="m175 111 1 35 9-9 8 16 7-4-8-15 13-1Z" fill="#EF8E7A" stroke="#F9FCFD" stroke-width="3" stroke-linejoin="round"/>
    <path d="m175 111 1 35 9-9 8 16 7-4-8-15 13-1Z" stroke="#BA675C" stroke-width=".8" stroke-linejoin="round"/>
  </g>
</svg>`;

export const projectArt = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" fill="none" aria-hidden="true" focusable="false">
  <defs>
    <filter id="project-browser-shadow" x="-15%" y="-15%" width="130%" height="145%" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#5C503B" flood-opacity=".10"/>
      <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#5C503B" flood-opacity=".07"/>
    </filter>
    <clipPath id="project-browser-clip"><rect x="66" y="30" width="668" height="391" rx="11"/></clipPath>
  </defs>
  <rect width="800" height="450" fill="#F0EBDD"/>
  <g fill="#D8D2C3">
    <circle cx="27" cy="104" r="1.5"/><circle cx="41" cy="104" r="1.5"/><circle cx="27" cy="118" r="1.5"/><circle cx="41" cy="118" r="1.5"/>
    <circle cx="759" cy="331" r="1.5"/><circle cx="773" cy="331" r="1.5"/><circle cx="759" cy="345" r="1.5"/><circle cx="773" cy="345" r="1.5"/>
  </g>
  <rect x="66" y="30" width="668" height="391" rx="11" fill="#FFFCF5" filter="url(#project-browser-shadow)"/>
  <g clip-path="url(#project-browser-clip)">
    <path d="M66 30H734V61H66Z" fill="#F1F0EA"/>
    <path d="M66 61H734" stroke="#E0DED4"/>
    <circle cx="83" cy="45.5" r="3.5" fill="#DEAC9F"/>
    <circle cx="95" cy="45.5" r="3.5" fill="#E1CB91"/>
    <circle cx="107" cy="45.5" r="3.5" fill="#B4C1A4"/>
    <rect x="251" y="37" width="298" height="17" rx="4" fill="#FBFBF7" stroke="#E2E2DA"/>
    <text x="400" y="48.5" text-anchor="middle" fill="#929589" font-family="system-ui, sans-serif" font-size="7.5" letter-spacing=".3">a place for ideas</text>
    <path d="M703 42h10m-5-5v10" stroke="#9A9E93" stroke-width="1.2" stroke-linecap="round"/>

    <text x="102" y="101" fill="#313B33" font-family="Georgia, 'Times New Roman', serif" font-size="19" font-style="italic">hello, you.</text>
    <g fill="#757B71" font-family="system-ui, sans-serif" font-size="9">
      <text x="568" y="98">work</text><text x="611" y="98">about</text><text x="661" y="98">hello ↗</text>
    </g>
    <g transform="translate(400 127)" stroke="#3E68D3" stroke-width="1.7" stroke-linecap="round">
      <path d="M0-7V7M-6-3.5 6 3.5M-6 3.5 6-3.5"/>
    </g>
    <text x="400" y="172" text-anchor="middle" fill="#313B33" font-family="Georgia, 'Times New Roman', serif" font-size="33" letter-spacing="-1.1">A little corner.</text>
    <text x="400" y="208" text-anchor="middle" fill="#3968D8" font-family="Georgia, 'Times New Roman', serif" font-size="33" font-style="italic" letter-spacing="-1.1">A lot of possibility.</text>
    <text x="400" y="232" text-anchor="middle" fill="#85867B" font-family="system-ui, sans-serif" font-size="9">Making useful things, with a little personality.</text>

    <g transform="translate(180 270) rotate(-6 67 47)">
      <rect width="136" height="94" rx="6" fill="#E7DEF6" stroke="#D5C9E9"/>
      <path d="M0 17H136" stroke="#D5C9E9"/>
      <circle cx="10" cy="8.5" r="2" fill="#EF9B8A"/><circle cx="17" cy="8.5" r="2" fill="#DBC675"/><circle cx="24" cy="8.5" r="2" fill="#A9B895"/>
      <rect x="7" y="24" width="122" height="62" rx="4" fill="#F8F5FC"/>
      <g font-family="ui-monospace, Consolas, monospace" font-size="6.4">
        <text x="15" y="38" fill="#9D8CAF">// a work in progress</text>
        <text x="15" y="51" fill="#6F558A">const idea = {</text>
        <text x="23" y="63" fill="#6D6381">curiosity: true,</text>
        <text x="23" y="75" fill="#6D6381">aLittleChaos: true,</text>
        <text x="15" y="83" fill="#6F558A">};</text>
      </g>
    </g>
    <g transform="translate(333 254) rotate(3 67 58)">
      <path d="M1 3 128 0 132 112 0 116Z" fill="#F5E8A6" stroke="#E5D99E"/>
      <path d="M43 0H82L80 10H45Z" fill="#FFFCEF" fill-opacity=".6"/>
      <g transform="translate(106 22)" stroke="#3967DC" stroke-width="1.8" stroke-linecap="round">
        <path d="M0-7V7M-6-3.5 6 3.5M-6 3.5 6-3.5"/>
      </g>
      <g fill="#34415B" font-family="Georgia, 'Times New Roman', serif" font-size="21" font-style="italic" letter-spacing="-.8">
        <text x="14" y="38">make</text><text x="14" y="64">something</text><text x="14" y="89">good.</text>
      </g>
      <path d="M14 97c15-2 31-2 48-1" stroke="#416BD4" stroke-width="1.6" stroke-linecap="round"/>
      <text x="116" y="107" text-anchor="end" fill="#93865B" font-family="system-ui, sans-serif" font-size="4.5" letter-spacing=".6">NOTE TO SELF</text>
    </g>
    <g transform="translate(484 270) rotate(-4 67 48)">
      <rect width="136" height="97" rx="6" fill="#DDECF3" stroke="#C8DFE8"/>
      <rect x="8" y="8" width="120" height="81" rx="4" fill="#F9FCFD"/>
      <path d="M8 25H128" stroke="#DFE8EC"/>
      <circle cx="16" cy="16.5" r="3" fill="#3868D7"/>
      <path d="M25 16.5H44M111 16.5H120" stroke="#BCCAD1" stroke-width="1.5" stroke-linecap="round"/>
      <text x="16" y="39" fill="#3C4E5D" font-family="Georgia, 'Times New Roman', serif" font-size="10">little details.</text>
      <path d="M16 46H62M16 51H49" stroke="#D4DFE4" stroke-width="1.7" stroke-linecap="round"/>
      <rect x="87" y="32" width="31" height="23" rx="3" fill="#E7DEF2"/>
      <circle cx="103" cy="43" r="7" fill="#C0B0DB"/>
      <path d="m89 54 10-11 12 11" fill="#F3E6AE"/>
      <circle cx="21" cy="65" r="5.5" fill="#AEC5D1"/><circle cx="37" cy="65" r="5.5" fill="#D7C8EB"/><circle cx="53" cy="65" r="5.5" fill="#EBC6A8"/><circle cx="69" cy="65" r="5.5" fill="#B7C49C"/>
      <rect x="16" y="77" width="57" height="8" rx="4" fill="#3A69DA"/>
      <path d="m100 61 1 20 5-5 4 9 4-2-4-9 7-1Z" fill="#ED927C" stroke="#F9FCFD" stroke-width="1.7" stroke-linejoin="round"/>
    </g>

    <path d="M102 393H698" stroke="#E8E4D8"/>
    <text x="102" y="407" fill="#A09F92" font-family="system-ui, sans-serif" font-size="6.5" letter-spacing=".8">BUILT WITH CURIOSITY</text>
    <text x="698" y="407" text-anchor="end" fill="#5073CB" font-family="system-ui, sans-serif" font-size="7.5">take a look ↗</text>
  </g>
  <rect x="66.5" y="30.5" width="667" height="390" rx="10.5" stroke="#DAD7CB"/>
</svg>`;
