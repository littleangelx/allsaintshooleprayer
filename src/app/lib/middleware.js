export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const res = NextResponse.next();

  // ✅ public routes
  if (
    pathname === "/login" ||
    pathname === "/home" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return res;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookies) =>
          cookies.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options),
          ),
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🔒 require login for everything else (including /prayer-link)
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔒 admin-only routes
  if (pathname.startsWith("/admin")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("admin")
      .eq("user_id", user.id)
      .single();

    if (!profile?.admin) {
      return NextResponse.redirect(new URL("/prayer-link", req.url));
    }
  }

  return res;
}
