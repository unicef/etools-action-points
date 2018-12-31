import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-iconset-svg/iron-iconset-svg.js';
import '@polymer/iron-icon/iron-icon.js';
/**
* @polymer
* @extends HTMLElement
*/
class AppIcons extends PolymerElement {
  static get template() {
    return html`
      <iron-iconset-svg name="app-icons" size="72">
        <svg>
          <g id="auditor">
            <polygon id="Shape" fill="#4B6F80" points="0 0 72 0 72 72 0 72"></polygon>
            <path d="M23.503865,41.9922479 L13.7475703,50.9356847 C12.809942,51.7787221
                    12.7235394,53.2927162 13.6635678,54.2194258 C14.5163935,55.2298077
                    16.0524398,55.2298077 16.9900681,54.3899277 L26.8662144,45.3988081 
                    C29.1534651,47.0346495 31.958125,48 35.0008101,48 C42.6898328,48 
                    49,41.6915555 49,34.000405 C49,26.2233923 42.6898328,20 35.0008101,20 
                    C27.2226723,20 21,26.2233923 21,34.000405 C21,36.963461 21.9235789,39.7212935 
                    23.503865,41.9922479 Z M45,34.0383669 C45,39.5204865 40.5227339,44 
                    35.0398204,44 C29.4787142,44 25,39.5204865 25,34.0383669 C25,28.4787896 
                    29.4787142,24 35.0398204,24 C40.5227339,24 45,28.4795135 45,34.0383669 
                    Z" id="Shape" fill="#FFFFFF" fill-rule="nonzero">
              </path>
            <path d="M28.3870242,30 L38.6129758,30 C39.3946497,30 40,30.6567164 40,31.5013169 
                    L40,31.5013169 C40,32.3406497 39.3954622,33 38.6129758,33 L28.3870242,33 
                    C27.6061629,33 27,32.3406497 27,31.5013169 L27,31.5013169 C27.0008126,30.6567164 
                    27.6061629,30 28.3870242,30 L28.3870242,30 Z" id="Shape" fill="#FFFFFF" 
                    fill-rule="nonzero">
            </path>
            <path d="M35.3626352,35 L45.5453294,35 C46.3625696,35 47,35.600321 47,36.2849117 
                    L47,36.6300161 C47,37.3154093 46.3625696,38 45.5453294,38 L35.3626352,38 
                    C34.635726,38 34,37.3154093 34,36.6300161 L34,36.2849117 C34.0008522,35.5995185 
                    34.635726,35 35.3626352,35 L35.3626352,35 Z" id="Shape" fill="#FFFFFF" 
                    fill-rule="nonzero">
            </path>
            <path d="M50.1604413,15 L59,24.6224391 L59,57 L25,57 L25,41.0269897 C25.5885602,41.6259776 
                    27.0922557,42.8103914 27.765234,43.2387 L27.765234,54.271359 L56.1605523,54.271359 
                    L56.1605523,27.1191851 L47.5530572,27.1191851 L47.5530572,17.7496311 L27.765234,17.5761654 
                    L27.765234,23.4561281 C27.0922557,23.9729966 25.5877712,25.3091934 25,25.9081813 
                    L25,15 L50.1604413,15 Z M50,19 L50,25 L56,25 L50,19 Z" id="Shape" fill="#FFFFFF" 
                    fill-rule="nonzero">
            </path>
          </g>
  
          <g id="tpm">
            <polygon id="Shape" fill="#72C300" points="0 0 72 0 72 72 0 72"></polygon>
            <polygon id="Line" fill="#FFFFFF" fill-rule="nonzero" points="27 21 41 21 41 18 27 18"></polygon>
            <polygon id="Line" fill="#FFFFFF" fill-rule="nonzero" points="19 27 19 41 22 41 22 27"></polygon>
            <polygon id="Line" fill="#FFFFFF" fill-rule="nonzero" 
                     points="30.2380676 52.5051041 52.3234863 30.2756195 48.351059 30.2401733 30.2429601 
                            48.3491079">
            </polygon>
            <rect id="Rectangle-7" fill="#FFFFFF" x="13" y="13" width="14" height="14"></rect>
            <rect id="Rectangle-7" fill="#FFFFFF" x="45" y="13" width="14" height="14"></rect>
            <rect id="Rectangle-7" fill="#FFFFFF" x="13" y="44" width="14" height="14"></rect>
          </g>
  
          <g id="apd">
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="new-app-selector---after-TPM" transform="translate(-176.000000, -546.000000)">
                <g id="App-dropdown---big" transform="translate(150.000000, 227.000000)">
                  <g id="Group" transform="translate(26.000000, 319.000000)">
                    <g id="baseline-flag-24px">
                      <polygon id="Shape" fill="#00B8D4" points="0 0 72 0 72 72 0 72"></polygon>
                      <polygon id="Shape" points="13 13 60 13 60 60 13 60"></polygon>
                      <polygon id="Shape" fill="#FFFFFF" fill-rule="nonzero" 
                               points="40.7265185 24.2431373 39.9466667 20.3111111 22.4 20.3111111 22.4 53.7333333 
                               26.2992593 53.7333333 26.2992593 39.9712418 37.2171852 39.9712418 37.997037 
                               43.903268 51.6444444 43.903268 51.6444444 24.2431373">
                      </polygon>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </iron-iconset-svg>

      <iron-icon icon="inline:shape" role="img" aria-label="A shape"></iron-icon>
    `;
  }
}

customElements.define('app-icons', AppIcons);