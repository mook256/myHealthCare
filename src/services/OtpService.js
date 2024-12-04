export async function sendOTP(number) {
  const form = new FormData();
  form.append('number', number);
  await fetch('http://hospitan.capsuledna.com/api/createotp.php', {
    method: 'POST',
    body: form,
  });
}

export async function verifyCodeOTP(code) {
  try {
    const form = new FormData();
    form.append('otp', code);
    form.append('type', 'signupotp');
    form.append('userid', '000000');
    const res = await fetch('http://hospitan.capsuledna.com/api/checkotp.php', {
      method: 'POST',
      body: form,
    });
    const result = await res.text();

    if (result === 'OK') {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}
