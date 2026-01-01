const db = firebase.database();

function generateKey(){
  const days = Number(document.getElementById("duration").value);
  let expired = 0;

  if(days > 0){
    expired = Date.now() + days * 24 * 60 * 60 * 1000;
  }

  const key =
    "NOVA-" +
    Math.random().toString(36).substring(2,6).toUpperCase() +
    "-" +
    Math.random().toString(36).substring(2,6).toUpperCase();

  db.ref("keys/" + key).set({
    status: "active",
    expired: expired,
    created: Date.now()
  }).then(()=>{
    alert("Key berhasil dibuat");
  }).catch(err=>{
    alert("ERROR: " + err.message);
  });
}

db.ref("keys").on("value", snap=>{
  const list = document.getElementById("keyList");
  list.innerHTML = "";

  snap.forEach(k=>{
    const d = k.val();
    list.innerHTML += `
      <tr>
        <td>${k.key}</td>
        <td>${d.expired === 0 ? "Lifetime" : new Date(d.expired).toLocaleDateString()}</td>
        <td>${d.status}</td>
        <td>
          <button class="btn copy" onclick="copyKey('${k.key}')">Copy</button>
          ${
            d.status === "banned"
            ? `<button class="btn unban" onclick="setStatus('${k.key}','active')">Unban</button>`
            : `<button class="btn ban" onclick="setStatus('${k.key}','banned')">Ban</button>`
          }
          <button class="btn del" onclick="deleteKey('${k.key}')">Delete</button>
        </td>
      </tr>
    `;
  });
});

function setStatus(key,status){
  db.ref("keys/" + key + "/status").set(status);
}

function deleteKey(key){
  if(confirm("Hapus key ini?")){
    db.ref("keys/" + key).remove();
  }
}

function copyKey(key){
  navigator.clipboard.writeText(key);
  alert("Key disalin");
}