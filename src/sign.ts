async function sign() {
  const rustModule = await import('@zondax/filecoin-signing-tools')
  console.log('ru', rustModule)
}

sign()
