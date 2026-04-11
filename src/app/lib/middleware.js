export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // ✅ public routes
  if (
    pathname === "/login" ||
    pathname === "/home" ||
    pathname === "/prayer-link" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const res = NextResponse.next();

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

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔒 only admin routes protected
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
