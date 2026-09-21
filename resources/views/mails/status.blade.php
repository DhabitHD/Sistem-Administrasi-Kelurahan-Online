<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Layanan Kelurahan Betet</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f3f5f7; margin: 0; padding: 24px; }
        .card { max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e6e9ec; }
        .head { background: #2563EB; color: #fff; padding: 18px 24px; }
        .head h1 { margin: 0; font-size: 18px; }
        .body { padding: 24px; color: #1f2937; }
        .body .muted { color: #6b7280; }
        .foot { border-top: 1px solid #eef0f2; padding: 14px 24px; font-size: 12px; color: #9ca3af; }
    </style>
</head>
<body>
    <div class="card">
        <div class="head"><h1>Kelurahan Betet — Kota Kediri</h1></div>
        <div class="body">
            <p>Salam, <strong>{{ $nama }}</strong>.</p>
            <p>{{ $pesan }}</p>
            <p class="muted small">Pantau perkembangan layanan Anda melalui portal warga atau halaman pelacakan layanan.</p>
        </div>
        <div class="foot">Pesan otomatis dari sistem layanan Kelurahan Betet. Jangan balas email ini.</div>
    </div>
</body>
</html>