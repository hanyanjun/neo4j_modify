/*
 * Copyright (c) 2002-2019 "Neo4j,"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const icons = {
  'Expand / Collapse':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g class="icon"><defs><style>.a{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;}</style></defs><title>Expand / Collapse</title><circle class="a" cx="13.5" cy="10.498" r="3.75"/><circle class="a" cx="21" cy="2.998" r="2.25"/><circle class="a" cx="21" cy="15.748" r="2.25"/><circle class="a" cx="13.5" cy="20.998" r="2.25"/><circle class="a" cx="3" cy="20.998" r="2.25"/><circle class="a" cx="3.75" cy="5.248" r="2.25"/><line class="a" x1="16.151" y1="7.848" x2="19.411" y2="4.588"/><line class="a" x1="16.794" y1="12.292" x2="19.079" y2="14.577"/><line class="a" x1="13.5" y1="14.248" x2="13.5" y2="18.748"/><line class="a" x1="10.851" y1="13.147" x2="4.59" y2="19.408"/><line class="a" x1="10.001" y1="9.149" x2="5.61" y2="6.514"/></g></svg>',
  Unlock:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g class="icon"><defs><style>.a{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;}</style></defs><title>Unlock</title><path class="a" d="M.75,9.75V6a5.25,5.25,0,0,1,10.5,0V9.75"/><rect class="a" x="6.75" y="9.75" width="16.5" height="13.5" rx="1.5" ry="1.5"/><line class="a" x1="15" y1="15" x2="15" y2="18"/></g></svg>',
  New : 
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g class="icon"><defs><style>.a{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;}</style></defs><title>news</title><polygon fill-rule="evenodd"  points="13 11 22 11 22 13 13 13 13 22 11 22 11 13 2 13 2 11 11 11 11 2 13 2"/></g></svg>',
  Delete : 
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g class="icon"><defs><style>.a{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;}</style></defs><title>news</title><path fill="#333333" d="M19.376,9.81c-0.016-0.1-0.077-0.197-0.168-0.29c-0.733,0.745-3.683,0.868-7.209,0.868s-6.473-0.123-7.21-0.868C4.699,9.613,4.642,9.71,4.621,9.81H4.615l0.002,0.054c0,0.006-0.002,0.012-0.002,0.019c0,0.014,0.004,0.028,0.006,0.041l0.574,11.76h0.001C5.247,22.606,6.303,24,11.999,24c5.696,0,6.753-1.394,6.803-2.316h0.004l0.575-11.76c0.001-0.014,0.006-0.027,0.006-0.041c0-0.006-0.004-0.012-0.004-0.019l0.004-0.054H19.376z"/><path fill="#333333" d="M15.509,3.655V0.806c0-0.464-0.38-0.844-0.844-0.844H9.026c-0.463,0-0.842,0.379-0.842,0.842v2.882C5.467,3.994,3.607,4.618,3.607,5.341v1.373c0,0.282,0.285,0.55,0.797,0.792c1.34,0.629,4.238,1.066,7.595,1.066c3.36,0,6.256-0.437,7.598-1.066c0.509-0.242,0.796-0.51,0.796-0.792V5.341C20.393,4.593,18.389,3.949,15.509,3.655z M9.941,3.54L9.709,3.554v-1.15c0-0.503,0.07-0.915,0.153-0.915c0.085,0,0.565,0,1.069,0h1.831c0.501,0,0.983,0,1.067,0c0.084,0,0.153,0.412,0.153,0.915v1.132c-0.637-0.033-1.299-0.054-1.985-0.054C11.288,3.482,10.598,3.503,9.941,3.54z"/></g></svg>',
  Edit : 
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g class="icon"><defs><style>.a{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;}</style></defs><title>edit</title> <path fill-rule="evenodd" d="M14.8024118,6.44526791 L8.69610276,12.549589 C8.29095108,12.9079238 8.04030835,13.4092335 8,13.8678295 L8,16.0029438 L10.0639829,16.004826 C10.5982069,15.9670062 11.0954869,15.7183782 11.4947932,15.2616227 L17.556693,9.19972295 L14.8024118,6.44526791 Z M16.2168556,5.0312846 L18.9709065,7.78550938 L19.8647941,6.89162181 C19.9513987,6.80501747 20.0000526,6.68755666 20.0000526,6.56507948 C20.0000526,6.4426023 19.9513987,6.32514149 19.8647932,6.23853626 L17.7611243,4.13485646 C17.6754884,4.04854589 17.5589355,4 17.43735,4 C17.3157645,4 17.1992116,4.04854589 17.1135757,4.13485646 L16.2168556,5.0312846 Z M22,13 L22,20 C22,21.1045695 21.1045695,22 20,22 L4,22 C2.8954305,22 2,21.1045695 2,20 L2,4 C2,2.8954305 2.8954305,2 4,2 L11,2 L11,4 L4,4 L4,20 L20,20 L20,13 L22,13 Z M17.43735,2 C18.0920882,2 18.7197259,2.26141978 19.1781068,2.7234227 L21.2790059,4.82432181 C21.7406843,5.28599904 22.0000526,5.91216845 22.0000526,6.56507948 C22.0000526,7.21799052 21.7406843,7.84415992 21.2790068,8.30583626 L12.9575072,16.6237545 C12.2590245,17.4294925 11.2689,17.9245308 10.1346,18.0023295 L6,18.0023295 L6,17.0023295 L6.00324765,13.7873015 C6.08843822,12.7328366 6.57866679,11.7523321 7.32649633,11.0934196 L15.6953877,2.72462818 C16.1563921,2.2608295 16.7833514,2 17.43735,2 Z"/></g></svg>',  
    Remove:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g class="icon"><defs><style>.a{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;}</style></defs><title>Remove</title><path class="a" d="M8.153,13.664a12.271,12.271,0,0,1-5.936-4.15L1.008,7.96a.75.75,0,0,1,0-.92L2.217,5.486A12.268,12.268,0,0,1,11.9.75h0a12.269,12.269,0,0,1,9.684,4.736L22.792,7.04a.748.748,0,0,1,0,.92L21.584,9.514"/><path class="a" d="M10.4,10.937A3.749,3.749,0,1,1,15.338,9"/><circle class="a" cx="17.15" cy="17.25" r="6"/><line class="a" x1="14.15" y1="17.25" x2="20.15" y2="17.25"/></g></svg>'
}

export default icons
