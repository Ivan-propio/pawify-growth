// ===== EMAIL TEMPLATES =====
const SIGNUP_URL = 'https://pawify.dev/auth?mode=signup';
const CTA_BTN = 'display:inline-block;background:#00B4B4;color:#ffffff;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:700;font-size:17px;text-align:center;margin:8px 0 16px 0;letter-spacing:0.3px;';
const CTA_BTN_GHOST = 'display:inline-block;background:transparent;color:#00B4B4;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;text-align:center;border:2px solid #00B4B4;margin:8px 0 16px 0;';
const LOGO = '<img src="https://pawify.dev/lovable-uploads/5c350f48-97d8-4a9e-ab10-6dca2e82e498.png" alt="Pawify" style="height:40px;" onerror="this.style.display=\'none\'">';

const EMAIL_TEMPLATES = {
es: {
touch1: {
subject: '{name}: hay familias buscando adoptar en {city} ahora mismo',
html: `<div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;color:#333;">
<div style="text-align:center;padding:24px 0 16px;">${LOGO}</div>
<div style="background:#f0fdf4;border-radius:12px;padding:20px 24px;margin-bottom:20px;border-left:4px solid #00B4B4;">
<p style="margin:0;font-size:22px;font-weight:700;color:#1A3D2B;line-height:1.3;">Cada dia, familias en {city} buscan adoptar un animal.<br><span style="color:#00B4B4;">Pueden encontrar a los vuestros?</span></p>
</div>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Hola equipo de <strong>{name}</strong>,</p>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Soy Oliver, cofundador de <strong>Pawify</strong>. Creamos la plataforma para resolver un problema que conoceis bien: <strong>teneis animales increibles esperando un hogar, pero no llegan suficientes adoptantes.</strong></p>
<div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:20px 24px;margin:20px 0;">
<p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#1A3D2B;text-transform:uppercase;letter-spacing:1px;">Que hace Pawify por vosotros:</p>
<table style="width:100%;font-size:14px;line-height:1.6;">
<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#00B4B4;font-size:18px;">&#10003;</td><td style="padding:6px 0;">Publicais vuestros animales en <strong>2 minutos</strong></td></tr>
<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#00B4B4;font-size:18px;">&#10003;</td><td style="padding:6px 0;">Miles de personas en {city} y toda Espana los descubren</td></tr>
<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#00B4B4;font-size:18px;">&#10003;</td><td style="padding:6px 0;">Recibis solicitudes de adopcion <strong>directamente</strong></td></tr>
<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#00B4B4;font-size:18px;">&#10003;</td><td style="padding:6px 0;">CRM integrado para gestionar todo el proceso</td></tr>
</table></div>
<div style="background:linear-gradient(135deg,#1A3D2B,#2d5a3f);border-radius:12px;padding:24px;margin:20px 0;text-align:center;color:white;">
<p style="margin:0 0 4px;font-size:28px;font-weight:800;">100% GRATUITO</p>
<p style="margin:0 0 16px;font-size:14px;opacity:0.9;">Sin comisiones. Sin letra pequena. Sin limites. Para siempre.</p>
<a href="${SIGNUP_URL}" style="${CTA_BTN}">Crear cuenta gratuita &rarr;</a>
<p style="margin:12px 0 0;font-size:12px;opacity:0.7;">Tarda menos de 2 minutos. Sin tarjeta de credito.</p></div>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Si teneis cualquier duda, respondedme directamente a este email.</p>
<p style="font-size:15px;line-height:1.7;margin:0;">Un saludo,<br><strong>Oliver</strong><br><span style="color:#00B4B4;">Cofundador de Pawify</span><br><a href="https://pawify.dev" style="color:#00B4B4;font-size:13px;">pawify.dev</a></p>
<hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;">
<p style="font-size:11px;color:#aaa;text-align:center;">Si no quieres recibir mas emails, responde "No gracias".</p></div>`
},
touch2: {
subject: 'Esta semana, 3 refugios se unieron a Pawify. {name} tambien?',
html: `<div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;color:#333;">
<div style="text-align:center;padding:24px 0 16px;">${LOGO}</div>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Hola equipo de <strong>{name}</strong>,</p>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Os escribi hace unos dias. Se que cuidar animales os deja poco tiempo para emails, asi que voy <strong>directo al grano</strong>:</p>
<div style="background:#fffbeb;border-radius:12px;padding:20px 24px;margin:20px 0;border-left:4px solid #f59e0b;">
<p style="margin:0;font-size:15px;line-height:1.6;"><strong>Resultado real:</strong> Refugios que se unieron a Pawify recibieron sus primeras solicitudes de adopcion <strong>en los primeros 7 dias</strong>. Sin pagar nada.</p></div>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Mientras leeis este email, hay familias en {city} buscando un animal para adoptar. <strong>Vuestros animales podrian estar apareciendo en sus busquedas ahora mismo.</strong></p>
<div style="text-align:center;margin:24px 0;">
<a href="${SIGNUP_URL}" style="${CTA_BTN}">Unir {name} a Pawify &rarr;</a>
<p style="font-size:12px;color:#6b7280;margin:8px 0 0;">2 minutos. Gratis. Sin compromiso.</p></div>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Si no es el momento, lo entiendo perfectamente.</p>
<p style="font-size:15px;line-height:1.7;margin:0;">Un saludo,<br><strong>Oliver</strong><br><span style="color:#00B4B4;">Pawify</span></p>
<hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;">
<p style="font-size:11px;color:#aaa;text-align:center;">Responde "No gracias" para dejar de recibir emails.</p></div>`
},
touch3: {
subject: 'Ultimo email: {name} + Pawify',
html: `<div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;color:#333;">
<div style="text-align:center;padding:24px 0 16px;">${LOGO}</div>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Hola,</p>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Es el ultimo email que os envio sobre esto. Promesa.</p>
<div style="background:#fef2f2;border-radius:12px;padding:20px 24px;margin:20px 0;border-left:4px solid #ef4444;">
<p style="margin:0;font-size:15px;line-height:1.6;">Solo quiero que sepais que <strong>la puerta queda abierta</strong>. Si en algun momento <strong>{name}</strong> necesita mas visibilidad para encontrar hogares a sus animales, Pawify es gratuito y estamos aqui.</p></div>
<div style="text-align:center;margin:24px 0;">
<a href="${SIGNUP_URL}" style="${CTA_BTN_GHOST}">Crear cuenta cuando querais</a></div>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Mucho animo con vuestra labor. Lo que haceis importa.</p>
<p style="font-size:15px;line-height:1.7;margin:0;"><strong>Oliver</strong><br><span style="color:#00B4B4;">Pawify</span></p></div>`
}
},
fr: {
touch1: {
subject: '{name} : des familles cherchent a adopter a {city} en ce moment',
html: `<div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;color:#333;">
<div style="text-align:center;padding:24px 0 16px;">${LOGO}</div>
<div style="background:#f0fdf4;border-radius:12px;padding:20px 24px;margin-bottom:20px;border-left:4px solid #00B4B4;">
<p style="margin:0;font-size:22px;font-weight:700;color:#1A3D2B;line-height:1.3;">Chaque jour, des familles a {city} cherchent a adopter.<br><span style="color:#00B4B4;">Peuvent-elles trouver vos animaux ?</span></p></div>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Bonjour l'equipe de <strong>{name}</strong>,</p>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Je suis Oliver, cofondateur de <strong>Pawify</strong>. Nous avons cree la plateforme pour resoudre un probleme que vous connaissez bien : <strong>vous avez des animaux formidables qui attendent un foyer, mais pas assez d'adoptants les trouvent.</strong></p>
<div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:20px 24px;margin:20px 0;">
<p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#1A3D2B;text-transform:uppercase;letter-spacing:1px;">Ce que Pawify fait pour vous :</p>
<table style="width:100%;font-size:14px;line-height:1.6;">
<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#00B4B4;font-size:18px;">&#10003;</td><td style="padding:6px 0;">Publiez vos animaux en <strong>2 minutes</strong></td></tr>
<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#00B4B4;font-size:18px;">&#10003;</td><td style="padding:6px 0;">Des milliers de personnes les decouvrent</td></tr>
<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#00B4B4;font-size:18px;">&#10003;</td><td style="padding:6px 0;">Recevez des demandes d'adoption <strong>directement</strong></td></tr>
<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#00B4B4;font-size:18px;">&#10003;</td><td style="padding:6px 0;">CRM integre pour tout gerer</td></tr>
</table></div>
<div style="background:linear-gradient(135deg,#1A3D2B,#2d5a3f);border-radius:12px;padding:24px;margin:20px 0;text-align:center;color:white;">
<p style="margin:0 0 4px;font-size:28px;font-weight:800;">100% GRATUIT</p>
<p style="margin:0 0 16px;font-size:14px;opacity:0.9;">Sans frais. Sans engagement. Sans limites. Pour toujours.</p>
<a href="${SIGNUP_URL}" style="${CTA_BTN}">Creer un compte gratuit &rarr;</a>
<p style="margin:12px 0 0;font-size:12px;opacity:0.7;">Moins de 2 minutes. Sans carte bancaire.</p></div>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Une question ? Repondez directement a cet email.</p>
<p style="font-size:15px;line-height:1.7;margin:0;">Cordialement,<br><strong>Oliver</strong><br><span style="color:#00B4B4;">Cofondateur de Pawify</span><br><a href="https://pawify.dev" style="color:#00B4B4;font-size:13px;">pawify.dev</a></p>
<hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;">
<p style="font-size:11px;color:#aaa;text-align:center;">Repondez "Non merci" pour ne plus recevoir d'emails.</p></div>`
},
touch2: {
subject: 'Cette semaine, 3 refuges ont rejoint Pawify. {name} aussi ?',
html: `<div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;color:#333;">
<div style="text-align:center;padding:24px 0 16px;">${LOGO}</div>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Bonjour l'equipe de <strong>{name}</strong>,</p>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Je vous ai ecrit il y a quelques jours. J'irai <strong>droit au but</strong> :</p>
<div style="background:#fffbeb;border-radius:12px;padding:20px 24px;margin:20px 0;border-left:4px solid #f59e0b;">
<p style="margin:0;font-size:15px;line-height:1.6;"><strong>Resultat concret :</strong> Les refuges sur Pawify recoivent des demandes d'adoption <strong>en 7 jours</strong>. Gratuitement.</p></div>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Des familles a {city} cherchent un animal a adopter maintenant. <strong>Vos animaux pourraient apparaitre dans leurs recherches.</strong></p>
<div style="text-align:center;margin:24px 0;">
<a href="${SIGNUP_URL}" style="${CTA_BTN}">Inscrire {name} sur Pawify &rarr;</a>
<p style="font-size:12px;color:#6b7280;margin:8px 0 0;">2 minutes. Gratuit. Sans engagement.</p></div>
<p style="font-size:15px;line-height:1.7;margin:0;">Cordialement,<br><strong>Oliver</strong><br><span style="color:#00B4B4;">Pawify</span></p></div>`
},
touch3: {
subject: 'Dernier email : {name} + Pawify',
html: `<div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;color:#333;">
<div style="text-align:center;padding:24px 0 16px;">${LOGO}</div>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Bonjour,</p>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Dernier email. Promis.</p>
<div style="background:#fef2f2;border-radius:12px;padding:20px 24px;margin:20px 0;border-left:4px solid #ef4444;">
<p style="margin:0;font-size:15px;line-height:1.6;"><strong>La porte reste ouverte.</strong> Si <strong>{name}</strong> a besoin de plus de visibilite, Pawify est gratuit.</p></div>
<div style="text-align:center;margin:24px 0;">
<a href="${SIGNUP_URL}" style="${CTA_BTN_GHOST}">Creer un compte quand vous voulez</a></div>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Bon courage. Ce que vous faites compte.</p>
<p style="font-size:15px;line-height:1.7;margin:0;"><strong>Oliver</strong><br><span style="color:#00B4B4;">Pawify</span></p></div>`
}
},
pt: {
touch1: {
subject: '{name}: familias procuram adotar em {city} neste momento',
html: `<div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;color:#333;">
<div style="text-align:center;padding:24px 0 16px;">${LOGO}</div>
<div style="background:#f0fdf4;border-radius:12px;padding:20px 24px;margin-bottom:20px;border-left:4px solid #00B4B4;">
<p style="margin:0;font-size:22px;font-weight:700;color:#1A3D2B;line-height:1.3;">Todos os dias, familias em {city} procuram adotar.<br><span style="color:#00B4B4;">Conseguem encontrar os vossos animais?</span></p></div>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Ola equipa do <strong>{name}</strong>,</p>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Sou o Oliver, cofundador do <strong>Pawify</strong>. Criamos a plataforma para resolver um problema que conhecem bem: <strong>tem animais incriveis a espera de um lar, mas nao chegam adoptantes suficientes.</strong></p>
<div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:20px 24px;margin:20px 0;">
<p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#1A3D2B;text-transform:uppercase;letter-spacing:1px;">O que o Pawify faz por voces:</p>
<table style="width:100%;font-size:14px;line-height:1.6;">
<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#00B4B4;font-size:18px;">&#10003;</td><td style="padding:6px 0;">Publicam animais em <strong>2 minutos</strong></td></tr>
<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#00B4B4;font-size:18px;">&#10003;</td><td style="padding:6px 0;">Milhares de pessoas descobrem-nos</td></tr>
<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#00B4B4;font-size:18px;">&#10003;</td><td style="padding:6px 0;">Recebem pedidos de adocao <strong>diretamente</strong></td></tr>
<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#00B4B4;font-size:18px;">&#10003;</td><td style="padding:6px 0;">CRM integrado para gerir tudo</td></tr>
</table></div>
<div style="background:linear-gradient(135deg,#1A3D2B,#2d5a3f);border-radius:12px;padding:24px;margin:20px 0;text-align:center;color:white;">
<p style="margin:0 0 4px;font-size:28px;font-weight:800;">100% GRATUITO</p>
<p style="margin:0 0 16px;font-size:14px;opacity:0.9;">Sem custos. Sem compromisso. Sem limites. Para sempre.</p>
<a href="${SIGNUP_URL}" style="${CTA_BTN}">Criar conta gratuita &rarr;</a>
<p style="margin:12px 0 0;font-size:12px;opacity:0.7;">Menos de 2 minutos. Sem cartao.</p></div>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Alguma duvida? Respondam diretamente.</p>
<p style="font-size:15px;line-height:1.7;margin:0;">Cumprimentos,<br><strong>Oliver</strong><br><span style="color:#00B4B4;">Cofundador do Pawify</span><br><a href="https://pawify.dev" style="color:#00B4B4;font-size:13px;">pawify.dev</a></p>
<hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;">
<p style="font-size:11px;color:#aaa;text-align:center;">Responda "Nao obrigado" para parar.</p></div>`
},
touch2: {
subject: 'Esta semana, 3 abrigos juntaram-se ao Pawify. {name} tambem?',
html: `<div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;color:#333;">
<div style="text-align:center;padding:24px 0 16px;">${LOGO}</div>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Ola equipa do <strong>{name}</strong>,</p>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Escrevi ha uns dias. Vou <strong>direto ao ponto</strong>:</p>
<div style="background:#fffbeb;border-radius:12px;padding:20px 24px;margin:20px 0;border-left:4px solid #f59e0b;">
<p style="margin:0;font-size:15px;line-height:1.6;"><strong>Resultado real:</strong> Abrigos no Pawify recebem pedidos de adocao <strong>em 7 dias</strong>. Sem pagar nada.</p></div>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Familias em {city} procuram adotar agora. <strong>Os vossos animais podiam aparecer nas pesquisas deles.</strong></p>
<div style="text-align:center;margin:24px 0;">
<a href="${SIGNUP_URL}" style="${CTA_BTN}">Juntar {name} ao Pawify &rarr;</a>
<p style="font-size:12px;color:#6b7280;margin:8px 0 0;">2 minutos. Gratis. Sem compromisso.</p></div>
<p style="font-size:15px;line-height:1.7;margin:0;">Cumprimentos,<br><strong>Oliver</strong><br><span style="color:#00B4B4;">Pawify</span></p></div>`
},
touch3: {
subject: 'Ultima mensagem: {name} + Pawify',
html: `<div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;color:#333;">
<div style="text-align:center;padding:24px 0 16px;">${LOGO}</div>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Ola,</p>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Ultimo email. Promessa.</p>
<div style="background:#fef2f2;border-radius:12px;padding:20px 24px;margin:20px 0;border-left:4px solid #ef4444;">
<p style="margin:0;font-size:15px;line-height:1.6;"><strong>A porta fica aberta.</strong> Se <strong>{name}</strong> precisar de mais visibilidade, o Pawify e gratuito.</p></div>
<div style="text-align:center;margin:24px 0;">
<a href="${SIGNUP_URL}" style="${CTA_BTN_GHOST}">Criar conta quando quiserem</a></div>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Muita forca. O que fazem importa.</p>
<p style="font-size:15px;line-height:1.7;margin:0;"><strong>Oliver</strong><br><span style="color:#00B4B4;">Pawify</span></p></div>`
}
},
en: {
touch1: {
subject: '{name}: families are looking to adopt in {city} right now',
html: `<div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;color:#333;">
<div style="text-align:center;padding:24px 0 16px;">${LOGO}</div>
<div style="background:#f0fdf4;border-radius:12px;padding:20px 24px;margin-bottom:20px;border-left:4px solid #00B4B4;">
<p style="margin:0;font-size:22px;font-weight:700;color:#1A3D2B;line-height:1.3;">Every day, families in {city} are searching to adopt.<br><span style="color:#00B4B4;">Can they find your animals?</span></p></div>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Hi <strong>{name}</strong> team,</p>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">I'm Oliver, co-founder of <strong>Pawify</strong>. We built the platform to solve a problem you know well: <strong>you have amazing animals waiting for homes, but not enough adopters find them.</strong></p>
<div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:20px 24px;margin:20px 0;">
<p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#1A3D2B;text-transform:uppercase;letter-spacing:1px;">What Pawify does for you:</p>
<table style="width:100%;font-size:14px;line-height:1.6;">
<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#00B4B4;font-size:18px;">&#10003;</td><td style="padding:6px 0;">List your animals in <strong>2 minutes</strong></td></tr>
<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#00B4B4;font-size:18px;">&#10003;</td><td style="padding:6px 0;">Thousands discover them</td></tr>
<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#00B4B4;font-size:18px;">&#10003;</td><td style="padding:6px 0;">Get adoption requests <strong>directly</strong></td></tr>
<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#00B4B4;font-size:18px;">&#10003;</td><td style="padding:6px 0;">Built-in CRM to manage everything</td></tr>
</table></div>
<div style="background:linear-gradient(135deg,#1A3D2B,#2d5a3f);border-radius:12px;padding:24px;margin:20px 0;text-align:center;color:white;">
<p style="margin:0 0 4px;font-size:28px;font-weight:800;">100% FREE</p>
<p style="margin:0 0 16px;font-size:14px;opacity:0.9;">No fees. No fine print. No limits. Forever.</p>
<a href="${SIGNUP_URL}" style="${CTA_BTN}">Create free account &rarr;</a>
<p style="margin:12px 0 0;font-size:12px;opacity:0.7;">Less than 2 minutes. No credit card.</p></div>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Questions? Just reply to this email.</p>
<p style="font-size:15px;line-height:1.7;margin:0;">Best,<br><strong>Oliver</strong><br><span style="color:#00B4B4;">Co-founder of Pawify</span><br><a href="https://pawify.dev" style="color:#00B4B4;font-size:13px;">pawify.dev</a></p>
<hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;">
<p style="font-size:11px;color:#aaa;text-align:center;">Reply "No thanks" to stop.</p></div>`
},
touch2: {
subject: 'This week, 3 shelters joined Pawify. Will {name}?',
html: `<div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;color:#333;">
<div style="text-align:center;padding:24px 0 16px;">${LOGO}</div>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Hi <strong>{name}</strong> team,</p>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">I reached out a few days ago. <strong>Straight to the point</strong>:</p>
<div style="background:#fffbeb;border-radius:12px;padding:20px 24px;margin:20px 0;border-left:4px solid #f59e0b;">
<p style="margin:0;font-size:15px;line-height:1.6;"><strong>Real result:</strong> Shelters on Pawify get adoption requests <strong>within 7 days</strong>. Free.</p></div>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Families in {city} are searching to adopt right now. <strong>Your animals could be showing up.</strong></p>
<div style="text-align:center;margin:24px 0;">
<a href="${SIGNUP_URL}" style="${CTA_BTN}">Add {name} to Pawify &rarr;</a>
<p style="font-size:12px;color:#6b7280;margin:8px 0 0;">2 minutes. Free. No commitment.</p></div>
<p style="font-size:15px;line-height:1.7;margin:0;">Best,<br><strong>Oliver</strong><br><span style="color:#00B4B4;">Pawify</span></p></div>`
},
touch3: {
subject: 'Last email: {name} + Pawify',
html: `<div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;color:#333;">
<div style="text-align:center;padding:24px 0 16px;">${LOGO}</div>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Hi,</p>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Last email. Promise.</p>
<div style="background:#fef2f2;border-radius:12px;padding:20px 24px;margin:20px 0;border-left:4px solid #ef4444;">
<p style="margin:0;font-size:15px;line-height:1.6;"><strong>The door stays open.</strong> If <strong>{name}</strong> ever needs more visibility, Pawify is free.</p></div>
<div style="text-align:center;margin:24px 0;">
<a href="${SIGNUP_URL}" style="${CTA_BTN_GHOST}">Create account anytime</a></div>
<p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Keep up the incredible work. What you do matters.</p>
<p style="font-size:15px;line-height:1.7;margin:0;"><strong>Oliver</strong><br><span style="color:#00B4B4;">Pawify</span></p></div>`
}
}
};
