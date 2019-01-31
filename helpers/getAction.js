function getAction(status) {
  if(status == 'permintaan tagihan diterima') {
    return 'ingatkan'
  } else if(status == 'menunggu konfrimasi') {
    return 'ingatkan'
  } else if(status == 'permintaan tagihan ditolak') {
    return 'diam'
  } else if(status == 'sudah terbayar') {
    return 'konfirmasi'
  } else if(status == 'selesai') {
    return 'diam'
  }
}

module.exports = getAction