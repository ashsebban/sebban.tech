const actions = [
  { id:'open-menu', icon:'≡', label:'Options', dialog:true },
  { id:'resign', icon:'⚑', label:'Resign', dialog:true },
  { id:'hint', icon:'✧', label:'Hint' },
  { id:'undo', icon:'↶', label:'Undo' },
];

// Put this group immediately after the board in each variation.
export function mountMatchActions(group) {
  for (const {id,icon,label,dialog} of actions) {
    const button = document.createElement('button');
    const glyph = document.createElement('span');
    button.type = 'button';
    button.id = id;
    if (dialog) button.setAttribute('aria-haspopup','dialog');
    glyph.className = 'action-icon';
    glyph.setAttribute('aria-hidden','true');
    glyph.textContent = icon;
    button.append(glyph, label);
    group.append(button);
  }
}
