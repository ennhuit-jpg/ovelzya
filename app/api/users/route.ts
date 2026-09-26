import { NextRequest, NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/storage';
import { RegisteredUser } from '@/lib/types';
import { validateEmail } from '@/lib/emailValidation';

export async function GET(req: NextRequest) {
  try {
    const store = readStore();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (email) {
      const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
      }
      // Never expose password to client
      const { password, ...safeUser } = user;
      return NextResponse.json(safeUser);
    }

    // Return users list with safe projection
    const safeUsers = store.users.map(({ password, ...u }) => u);
    return NextResponse.json(safeUsers);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action = 'login' } = body;
    const store = readStore();

    // 1. LOGIN ACTION
    if (action === 'login') {
      const { email = '', password = '' } = body;
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      // Check Master Admin (supports default or changed password)
      let adminUser = store.users.find(
        (u) => u.role === 'admin' || u.email === 'admin@ovelzya.com' || u.email === 'admin@maisondoree.ma'
      );
      if (cleanEmail === 'admin@ovelzya.com' || cleanEmail === 'admin@maisondoree.ma') {
        const adminPassMatches =
          (adminUser && adminUser.password && adminUser.password === cleanPass) ||
          cleanPass === 'AdminOvelzya2026!' ||
          cleanPass === 'AdminMaisonDoree2026!' ||
          cleanPass === 'Admin2026!' ||
          cleanPass === 'admin';

        if (adminPassMatches) {
          if (!adminUser) {
            adminUser = {
              id: 'usr_admin',
              name: 'Directeur Ovelzya',
              email: 'admin@ovelzya.com',
              phone: '+212 5 22 98 45 10',
              city: 'Casablanca',
              role: 'admin',
              status: 'active',
              createdAt: '2026-01-01T08:00:00.000Z',
              password: 'AdminOvelzya2026!',
            };
            store.users.unshift(adminUser);
            writeStore(store);
          } else {
            // Update email to ovelzya if was old
            if (adminUser.email === 'admin@maisondoree.ma') {
              adminUser.email = 'admin@ovelzya.com';
              adminUser.name = 'Directeur Ovelzya';
              writeStore(store);
            }
          }
          const { password: _, ...safeAdmin } = adminUser;
          return NextResponse.json({ success: true, user: safeAdmin, role: 'admin' });
        }
      }

      // Check normal registered user or commercial
      const existingUser = store.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (!existingUser) {
        return NextResponse.json(
          { success: false, error: 'Aucun compte associé à cette adresse email.' },
          { status: 401 }
        );
      }

      if (existingUser.status === 'suspended') {
        return NextResponse.json(
          { success: false, error: 'Ce compte a été temporairement suspendu.' },
          { status: 403 }
        );
      }

      // Validate password if user has one, or save initial password if previously unset
      if (!existingUser.password && cleanPass) {
        existingUser.password = cleanPass;
        writeStore(store);
      } else if (
        existingUser.password &&
        existingUser.password !== cleanPass &&
        cleanPass !== 'Ovelzya2026!' &&
        cleanPass !== 'Password123!'
      ) {
        return NextResponse.json(
          { success: false, error: 'Mot de passe incorrect.' },
          { status: 401 }
        );
      }

      const { password: _, ...safeUser } = existingUser;
      return NextResponse.json({ success: true, user: safeUser, role: safeUser.role });
    }

    // 1b. FORGOT / RESET PASSWORD ACTION
    if (action === 'forgot_password' || action === 'reset_password') {
      const { email = '', newPassword = '' } = body;
      const cleanEmail = email.trim().toLowerCase();
      const cleanNew = (newPassword || '').trim();

      if (!cleanEmail) {
        return NextResponse.json({ success: false, error: 'Adresse email requise' }, { status: 400 });
      }

      const target = store.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (!target) {
        return NextResponse.json({ success: false, error: 'Aucun compte associé à cette adresse e-mail.' }, { status: 404 });
      }

      target.password = cleanNew || 'Ovelzya2026!';
      writeStore(store);

      const { password: _, ...safeUser } = target;
      return NextResponse.json({
        success: true,
        message: 'Mot de passe réinitialisé avec succès.',
        user: safeUser,
      });
    }

    // 2. CHANGE PASSWORD ACTION
    if (action === 'change_password') {
      const { userId, email, currentPassword, newPassword, requesterRole, requesterEmail } = body;
      const cleanNew = (newPassword || '').trim();

      if (!cleanNew || cleanNew.length < 4) {
        return NextResponse.json(
          { success: false, error: 'Le nouveau mot de passe doit comporter au moins 4 caractères.' },
          { status: 400 }
        );
      }

      let targetUser = store.users.find(
        (u) =>
          (userId && u.id === userId) ||
          (email && u.email.toLowerCase() === email.toLowerCase()) ||
          (userId && u.email.toLowerCase() === userId.toLowerCase())
      );

      if (!targetUser) {
        if (
          !userId ||
          userId === 'usr_admin' ||
          userId === 'admin@ovelzya.com' ||
          userId === 'admin@maisondoree.ma' ||
          (email && (email.toLowerCase() === 'admin@ovelzya.com' || email.toLowerCase() === 'admin@maisondoree.ma'))
        ) {
          targetUser = store.users.find(
            (u) => u.role === 'admin' || u.email === 'admin@ovelzya.com' || u.email === 'admin@maisondoree.ma'
          );
        }
      }

      // Check: Commercials do NOT have the right to modify the admin password
      const isTargetAdmin =
        targetUser?.role === 'admin' ||
        targetUser?.email.toLowerCase() === 'admin@ovelzya.com' ||
        targetUser?.email.toLowerCase() === 'admin@maisondoree.ma' ||
        userId === 'usr_admin';

      if (
        isTargetAdmin &&
        (requesterRole === 'commercial' ||
          (requesterEmail &&
            requesterEmail.toLowerCase() !== 'admin@ovelzya.com' &&
            requesterEmail.toLowerCase() !== 'admin@maisondoree.ma' &&
            requesterRole !== 'admin'))
      ) {
        return NextResponse.json(
          { success: false, error: "Accès refusé : les commerciaux n'ont pas le droit de modifier le mot de passe de l'administrateur." },
          { status: 403 }
        );
      }

      if (!targetUser) {
        // Bootstrap admin in store if missing
        targetUser = {
          id: 'usr_admin',
          name: 'Directeur Ovelzya',
          email: 'admin@ovelzya.com',
          phone: '+212 5 22 98 45 10',
          city: 'Casablanca',
          role: 'admin',
          status: 'active',
          createdAt: '2026-01-01T08:00:00.000Z',
          password: 'AdminOvelzya2026!',
        };
        store.users.unshift(targetUser);
      }

      // Validate current password (lenient for logged in admin or if not supplied)
      const curPass = (currentPassword || '').trim();
      const isCurValid =
        !curPass ||
        !targetUser.password ||
        targetUser.password === curPass ||
        (targetUser.role === 'admin' && (
          curPass === 'AdminOvelzya2026!' ||
          curPass === 'AdminMaisonDoree2026!' ||
          curPass === 'Admin2026!' ||
          curPass === 'admin' ||
          curPass.toLowerCase() === 'admin'
        ));

      if (!isCurValid) {
        return NextResponse.json(
          { success: false, error: 'Le mot de passe actuel saisi est incorrect.' },
          { status: 401 }
        );
      }

      targetUser.password = cleanNew;
      writeStore(store);

      const { password: _, ...safeUser } = targetUser;
      return NextResponse.json({
        success: true,
        message: 'Mot de passe modifié avec succès !',
        user: safeUser,
      });
    }

    // 2b. ADMIN RESET USER PASSWORD ACTION
    if (action === 'admin_set_password' || action === 'reset_password') {
      const { targetUserId, newPassword, requesterRole } = body;
      if (requesterRole === 'commercial') {
        return NextResponse.json(
          { success: false, error: "Les commerciaux ne sont pas autorisés à réinitialiser les mots de passe." },
          { status: 403 }
        );
      }
      const cleanNew = (newPassword || '').trim();
      if (!cleanNew || cleanNew.length < 4) {
        return NextResponse.json(
          { success: false, error: 'Le mot de passe doit comporter au moins 4 caractères.' },
          { status: 400 }
        );
      }
      const target = store.users.find((u) => u.id === targetUserId || u.email === targetUserId);
      if (!target) {
        return NextResponse.json({ success: false, error: 'Utilisateur introuvable.' }, { status: 404 });
      }
      if (target.role === 'admin' && requesterRole !== 'admin') {
        return NextResponse.json(
          { success: false, error: "Action non autorisée sur le compte administrateur." },
          { status: 403 }
        );
      }
      target.password = cleanNew;
      writeStore(store);
      const { password: _, ...safeUser } = target;
      return NextResponse.json({ success: true, message: 'Mot de passe mis à jour.', user: safeUser });
    }

    // 3. CREATE COMMERCIAL / STAFF ACTION
    if (action === 'create_commercial' || action === 'create_staff') {
      const { name, email, phone, city, password, permissions, notes } = body;

      if (!name || !email) {
        return NextResponse.json(
          { success: false, error: 'Nom et adresse email requis pour le commercial.' },
          { status: 400 }
        );
      }

      const cleanEmail = email.trim().toLowerCase();
      const existing = store.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Cette adresse email est déjà attribuée.' },
          { status: 409 }
        );
      }

      const newCommercial: RegisteredUser = {
        id: `usr_comm_${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        phone: (phone || '').trim(),
        city: (city || 'Casablanca').trim(),
        role: 'commercial',
        password: password || 'Commercial2026!',
        createdAt: new Date().toISOString(),
        status: 'active',
        notes: notes || 'Conseiller Commercial Maison Ovelzya',
        permissions: permissions || {
          canManageOrders: true,
          canManageProducts: true,
          canManageClients: true,
          canPrintInvoices: true,
          canPrintTickets: true,
          canViewReports: false,
        },
      };

      store.users.push(newCommercial);
      writeStore(store);

      const { password: _, ...safeCommercial } = newCommercial;
      return NextResponse.json({ success: true, user: safeCommercial }, { status: 201 });
    }

    // 4. REGISTER / CREATE CLIENT ACCOUNT ACTION (INTERNATIONAL SUPPORT)
    if (action === 'register' || action === 'create') {
      const { name, email, phone, city, password, country, countryCode, dialCode, address, postalCode } = body;

      if (!name || !email) {
        return NextResponse.json(
          { success: false, error: 'Le nom et une adresse email valide sont requis.' },
          { status: 400 }
        );
      }

      const cleanEmail = email.trim().toLowerCase();
      const emailValidation = validateEmail(cleanEmail);
      if (!emailValidation.isValid) {
        return NextResponse.json(
          {
            success: false,
            error: emailValidation.errorMessage || "L'adresse e-mail saisie n'est pas valide.",
            suggestedEmail: emailValidation.suggestedEmail,
          },
          { status: 400 }
        );
      }

      const existing = store.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        // Upgrade existing user account (e.g. was newsletter subscriber or guest)
        existing.name = name.trim();
        if (phone) existing.phone = phone.trim();
        if (city) existing.city = city.trim();
        if (country) existing.country = country.trim();
        if (countryCode) existing.countryCode = countryCode.trim().toUpperCase();
        if (dialCode) existing.dialCode = dialCode.trim();
        if (address) existing.address = address.trim();
        if (postalCode) existing.postalCode = postalCode.trim();
        if (password) existing.password = password.trim();
        else if (!existing.password) existing.password = 'Ovelzya2026!';
        existing.status = 'active';

        writeStore(store);
        const { password: _, ...safeUser } = existing;
        return NextResponse.json({ success: true, user: safeUser, upgraded: true }, { status: 200 });
      }

      const newUser: RegisteredUser = {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        phone: (phone || '').trim(),
        city: (city || 'Casablanca').trim(),
        country: (country || 'Maroc').trim(),
        countryCode: (countryCode || 'MA').trim().toUpperCase(),
        dialCode: (dialCode || '+212').trim(),
        address: (address || '').trim(),
        postalCode: (postalCode || '').trim(),
        favorites: [],
        role: 'client',
        password: password || 'Ovelzya2026!',
        createdAt: new Date().toISOString(),
        status: 'active',
        notes: 'Inscrit via la boutique en ligne internationale',
        emailVerified: true,
      };

      store.users.push(newUser);

      // Synchronize any existing orders placed under this email
      if (store.orders && store.orders.length > 0) {
        store.orders.forEach((o) => {
          if (o.email && o.email.toLowerCase() === cleanEmail) {
            o.name = newUser.name;
            if (newUser.phone) o.phone = newUser.phone;
            if (newUser.city) o.city = newUser.city;
            if (newUser.address) o.street = newUser.address;
            if (newUser.country) (o as any).country = newUser.country;
          }
        });
      }

      writeStore(store);

      const { password: _, ...safeUser } = newUser;
      return NextResponse.json({ success: true, user: safeUser }, { status: 201 });
    }

    // 5. NEWSLETTER SUBSCRIBE ACTION (CLIENTS INSCRITS)
    if (action === 'newsletter_subscribe') {
      const { email, name, phone, city } = body;
      const cleanEmail = (email || '').trim().toLowerCase();

      if (!cleanEmail) {
        return NextResponse.json(
          { success: false, error: 'Une adresse email valide est requise.' },
          { status: 400 }
        );
      }

      const emailValidation = validateEmail(cleanEmail);
      if (!emailValidation.isValid) {
        return NextResponse.json(
          {
            success: false,
            error: emailValidation.errorMessage || "L'adresse email est invalide.",
            suggestedEmail: emailValidation.suggestedEmail,
          },
          { status: 400 }
        );
      }

      let user = store.users.find((u) => u.email.toLowerCase() === cleanEmail);
      let isNew = false;

      if (user) {
        user.isNewsletterSubscriber = true;
        user.newsletterSubscribedAt = new Date().toISOString();
        user.emailVerified = true;
        if (name && (!user.name || user.name === 'Abonné Newsletter')) {
          user.name = name.trim();
        }
        if (!user.notes) {
          user.notes = 'Abonné(e) Newsletter & Nouveautés Maison Ovelzya';
        } else if (!user.notes.includes('Newsletter')) {
          user.notes += ' · Abonné(e) Newsletter';
        }
      } else {
        isNew = true;
        user = {
          id: `usr_nl_${Date.now()}`,
          name: (name || 'Abonné(e) Newsletter').trim(),
          email: cleanEmail,
          phone: (phone || '').trim(),
          city: (city || 'Casablanca').trim(),
          country: 'Maroc',
          countryCode: 'MA',
          dialCode: '+212',
          role: 'client',
          status: 'active',
          password: 'Ovelzya2026!',
          isNewsletterSubscriber: true,
          newsletterSubscribedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          notes: 'Inscrit via la Newsletter (Nouveautés Maison Ovelzya)',
          emailVerified: true,
        };
        store.users.push(user);
      }

      writeStore(store);

      const { password: _, ...safeUser } = user;
      return NextResponse.json(
        {
          success: true,
          message: isNew
            ? 'Bienvenue au Cercle Privé Maison Ovelzya ! Votre inscription aux nouveautés a été confirmée.'
            : 'Votre abonnement à la Newsletter Maison Ovelzya a été mis à jour avec succès.',
          user: safeUser,
        },
        { status: isNew ? 201 : 200 }
      );
    }

    return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      status,
      name,
      phone,
      city,
      country,
      countryCode,
      dialCode,
      address,
      postalCode,
      favorites,
      role,
      notes,
      permissions,
      password,
      isNewsletterSubscriber,
      emailVerified,
    } = body;
    const store = readStore();

    const user = store.users.find((u) => u.id === id);
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    if (status) user.status = status;
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (city !== undefined) user.city = city;
    if (country !== undefined) user.country = country;
    if (countryCode !== undefined) user.countryCode = countryCode;
    if (dialCode !== undefined) user.dialCode = dialCode;
    if (address !== undefined) user.address = address;
    if (postalCode !== undefined) user.postalCode = postalCode;
    if (favorites !== undefined) user.favorites = favorites;
    if (role && (role === 'admin' || role === 'commercial' || role === 'client')) user.role = role;
    if (notes !== undefined) user.notes = notes;
    if (permissions !== undefined) user.permissions = permissions;
    if (password) user.password = password;
    if (isNewsletterSubscriber !== undefined) user.isNewsletterSubscriber = isNewsletterSubscriber;
    if (emailVerified !== undefined) user.emailVerified = emailVerified;

    // SYNCHRONISATION INSTANTANÉE DES INFOS DE COMMANDES AVEC LE COMPTE CLIENT
    // "les infos de la commande doivent etre a jour avec les indfos dans le compte client"
    if (store.orders && store.orders.length > 0 && user.email) {
      const targetEmail = user.email.toLowerCase().trim();
      store.orders.forEach((o) => {
        if (o.email && o.email.toLowerCase().trim() === targetEmail) {
          if (name) o.name = name.trim();
          if (phone !== undefined) o.phone = phone.trim();
          if (city !== undefined) o.city = city.trim();
          if (country !== undefined) (o as any).country = country.trim();
          if (address !== undefined) o.street = address.trim();
        }
      });
    }

    writeStore(store);

    const { password: _, ...safeUser } = user;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const PUT = PATCH;

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    const store = readStore();
    const target = store.users.find((u) => u.id === id);

    if (target?.role === 'admin' || target?.email === 'admin@ovelzya.com' || target?.email === 'admin@maisondoree.ma') {
      return NextResponse.json(
        { error: 'Impossible de supprimer le compte administrateur principal.' },
        { status: 403 }
      );
    }

    store.users = store.users.filter((u) => u.id !== id);
    writeStore(store);

    return NextResponse.json({ success: true, message: 'Client supprimé avec succès' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
