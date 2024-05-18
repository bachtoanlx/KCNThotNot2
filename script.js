//  Xử lý Menu -->
function toggleMenu() {
    var menu = document.querySelector('.menu');
    menu.style.display = (menu.style.display === 'block' || menu.style.display === '') ? 'none' : 'block';
}

$(document).ready(function() {
    // Đọc dữ liệu từ tệp JSON và xử lý đăng nhập
    $.getJSON('accounts.json', function(data) {
      // Lưu danh sách tài khoản vào localStorage để sử dụng trong mã xử lý đăng nhập
      localStorage.setItem('accounts', JSON.stringify(data.accounts));
  
      // Kiểm tra nếu đã đăng nhập trước đó (dựa trên localStorage)
      var savedUser = localStorage.getItem('loggedInUser');
      if (savedUser) {
        // Nếu đã đăng nhập, thay đổi chào mừng người dùng
        $('#navbarTitle').text('Xin chào, ' + savedUser); // Chào mừng người dùng trên thanh menu
        $('#loginButton').text('Đăng xuất'); // Thay đổi nút đăng nhập thành nút đăng xuất
      }
    });
  
    // Xử lý sự kiện khi click Đăng nhập hoặc Đăng xuất
    $('#loginButton').click(function() {
      var buttonText = $(this).text();
  
      if (buttonText === 'Đăng nhập') {
        // Hiển thị modal đăng nhập
        $('#loginModal').modal('show');
      } else if (buttonText === 'Đăng xuất') {
        // Đăng xuất
        $('#navbarTitle').text('Giải pháp công nghệ số'); // Thay đổi tiêu đề mặc định
        $('#loginButton').text('Đăng nhập'); // Thay đổi nút đăng xuất thành nút đăng nhập
  
        // Ẩn thông tin người dùng
        $('#userInfo').hide();
  
        // Xóa thông tin người dùng đã lưu trong localStorage
        localStorage.removeItem('loggedInUser');
        // Hiển thị modal thông báo đăng xuất thành công
        $('#logoutSuccessModal').modal('show');
      }
    });
  
    // Xử lý sự kiện khi click Đăng nhập trong modal
    $('#loginSubmitButton').click(function() {
      var username = $('#username').val();
      var password = $('#password').val();
  
      // Lấy danh sách tài khoản từ localStorage
      var accounts = JSON.parse(localStorage.getItem('accounts'));
  
      // Kiểm tra đăng nhập
      var loggedInUser = accounts.find(function(account) {
        return account.username === username && account.password === password;
      });
  
      if (loggedInUser) {
        // Thực hiện các thay đổi khi đăng nhập thành công
        $('#navbarTitle').text('Xin chào, ' + username); // Chào mừng người dùng trên thanh menu
        $('#loginButton').text('Đăng xuất'); // Thay đổi nút đăng nhập thành nút đăng xuất
        $('#loginModal').modal('hide'); // Ẩn modal đăng nhập
  
        // Lưu tên người dùng vào localStorage
        localStorage.setItem('loggedInUser', username);
      } else {
        alert('Tên đăng nhập hoặc mật khẩu không chính xác!');
      }
    });
  
    // Hiển thị modal đăng nhập sau 1 giây nếu người dùng chưa đăng nhập
    setTimeout(function() {
      // Lấy thông tin người dùng đã đăng nhập từ localStorage
      var loggedInUser = localStorage.getItem('loggedInUser');
  
      // Nếu người dùng chưa đăng nhập (không có thông tin người dùng trong localStorage), hiển thị modal đăng nhập
      if (!loggedInUser) {
        $('#loginModal').modal('show');
      }
    }, 1000); // Hiển thị modal sau 1 giây (1000 miliseconds) khi trang đã được tải xong
  });
  
  
  //Xử lý hành động gửi dữ liệu vào GG Sheet1
  function submitForm_1() {
    // Lấy thông tin người dùng đã đăng nhập từ localStorage
    var loggedInUser = localStorage.getItem('loggedInUser');
  
    if (!loggedInUser) {
        // Nếu người dùng chưa đăng nhập, hiển thị modal đăng nhập
        $('#loginModal').modal('show');
        return; // Dừng hàm submitForm ở đây để ngăn việc gửi dữ liệu khi chưa đăng nhập
    }
  
    // Hiển thị modal loading
    $('#loadingModal').modal('show');
  
    var c_ty = document.getElementById('c_ty').value;
    var chi_so = document.getElementById('chi_so').value;
    var ngay_ghi = document.getElementById('ngay_ghi').value || getCurrentDate();
    var ghi_chu = document.getElementById('ghi_chu').value;
  
    if (!c_ty || !chi_so) {
        $('#errorModal').modal('show'); // Hiển thị modal lỗi
        $('#loadingModal').modal('hide'); // Ẩn modal loading
        return;
    }
  
    var formData = {
        sheetName: 'Sheet1',
        user: loggedInUser, // Thêm thông tin người dùng đăng nhập vào đây
        c_ty: c_ty,
        chi_so: chi_so,
        ngay_ghi: ngay_ghi,
        ghi_chu: ghi_chu  
    };
  
    console.log(formData);
    fetch('https://script.google.com/macros/s/AKfycbzg9lkoiVZeVE7kXcDV7gVa7lijeXjP-tAHukkv4lac5fXNzBJNOLYQEiSyu9cVgkmy/exec', {
        method: 'POST',
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.result === 'success') {
            // Hiển thị modal thành công
            $('#successModal').modal('show');
  
            // Tự động đóng modal sau 2 giây
            setTimeout(function () {
                $('#successModal').modal('hide');
            }, 2000);
  
            // Reset form
            document.getElementById('registrationForm').reset();
        } else {
            // Hiển thị modal lỗi
            $('#errorModal').modal('show');
        }
    })
    .catch(error => {
        console.error('Đã xảy ra lỗi:', error);
        $('#errorModal').modal('show'); // Hiển thị modal lỗi
    })
    .finally(() => {
        // Ẩn modal loading sau khi hoàn thành
        $('#loadingModal').modal('hide');
    });
  }
  // ĐỊNH NGHĨA HÀM ĐỂ VIẾT HOA CHỮ CÁI ĐẦU CỦA CHUỖI
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  // Lắng nghe sự kiện khi người dùng nhập liệu vào trường input
  document.addEventListener('DOMContentLoaded', function() {
    var inputField = document.getElementById('ghi_chu');
  
    inputField.addEventListener('input', function() {
        // Lấy giá trị nhập vào từ trường input
        var inputValue = inputField.value;
  
        // Chuyển đổi chuỗi thành dạng viết hoa chữ cái đầu
        var capitalizedValue = capitalizeFirstLetter(inputValue);
  
        // Đặt lại giá trị đã chuyển đổi vào trường input
        inputField.value = capitalizedValue;
    });
  });
  
  // HÀM LẤY NGÀY HIỆN TẠI DƯỚI DẠNG CHUỖI YYYY-MM-DD
  function getCurrentDate() {
  var today = new Date();
  var year = today.getFullYear();
  var month = ('0' + (today.getMonth() + 1)).slice(-2); // Tháng đếm từ 0, cần cộng thêm 1 và format về dạng 2 chữ số
  var day = ('0' + today.getDate()).slice(-2); // Ngày format về dạng 2 chữ số
  return year + '-' + month + '-' + day;
  }
  
  function setMaxDateForNgayGhi() {
  var today = new Date();
  var year = today.getFullYear();
  var month = ('0' + (today.getMonth() + 1)).slice(-2); // Tháng đếm từ 0, cần cộng thêm 1 và format về dạng 2 chữ số
  var day = ('0' + today.getDate()).slice(-2); // Ngày format về dạng 2 chữ số
  
  var maxDate = year + '-' + month + '-' + day;
  
  // Đặt thuộc tính max cho input ngày ghi
  document.getElementById('ngay_ghi').setAttribute('max', maxDate);
  }
  
  // Gọi hàm setMaxDateForNgayGhi() khi tài liệu được tải
  document.addEventListener('DOMContentLoaded', function() {
  setMaxDateForNgayGhi();
  });

//Xử lý hành động gửi dữ liệu vào GG Sheet 2s
  function submitForm_2() {
    // Lấy thông tin người dùng đã đăng nhập từ localStorage
    var loggedInUser = localStorage.getItem('loggedInUser');

    if (!loggedInUser) {
        // Nếu người dùng chưa đăng nhập, hiển thị modal đăng nhập
        $('#loginModal').modal('show');
        return; // Dừng hàm submitForm ở đây để ngăn việc gửi dữ liệu khi chưa đăng nhập
    }

    // Hiển thị modal loading
    $('#loadingModal').modal('show');

    var c_ty = document.getElementById('c_ty').value;
    var ngay_nghi = document.getElementById('ngay_nghi').value || getCurrentDate();
    var ghi_chu = document.getElementById('ghi_chu').value;

    if (!c_ty || !ngay_nghi) {
        $('#errorModal').modal('show'); // Hiển thị modal lỗi
        $('#loadingModal').modal('hide'); // Ẩn modal loading
        return;
    }

    // Chia dữ liệu ngày thành một mảng các ngày
    var datesArray = ngay_nghi.split(',');

    // Khởi tạo biến đếm số lượng ngày gửi thành công
    var successCount = 0;

    // Lặp qua mỗi ngày và gửi dữ liệu
    datesArray.forEach(function(date) {
        var formData = {
            sheetName: 'Sheet2',
            user: loggedInUser, // Thêm thông tin người dùng đăng nhập vào đây
            c_ty: c_ty,
            ngay_nghi: date.trim(), // Lấy mỗi ngày trong danh sách
            ghi_chu: ghi_chu  
        };

        console.log(formData);

        // Gửi dữ liệu đi cho từng ngày
        fetch('https://script.google.com/macros/s/AKfycbzg9lkoiVZeVE7kXcDV7gVa7lijeXjP-tAHukkv4lac5fXNzBJNOLYQEiSyu9cVgkmy/exec', {
            method: 'POST',
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.result === 'success') {
                // Tăng biến đếm số lượng ngày gửi thành công
                successCount++;

                // Nếu số lượng ngày gửi thành công đạt đến tổng số ngày cần gửi, hiển thị modal thành công
                if (successCount === datesArray.length) {
                    // Hiển thị modal thành công
                    $('#successModal').modal('show');

                    // Tự động đóng modal sau 2 giây và reload trang
                    setTimeout(function () {
                        $('#successModal').modal('hide');
                        window.location.reload(); // Reload trang
                    }, 2000);
                }
            } else {
                // Hiển thị modal lỗi
                $('#errorModal').modal('show');
            }
        })
        .catch(error => {
            console.error('Đã xảy ra lỗi:', error);
            $('#errorModal').modal('show'); // Hiển thị modal lỗi
        })
        .finally(() => {
            // Nếu tất cả các yêu cầu đã được xử lý, ẩn modal loading
            if (successCount === datesArray.length) {
                $('#loadingModal').modal('hide');
            }
        });
    });
}


/*Xử lý hành động gửi dữ liệu vào GG Sheet (mẫu dự phòng)
  function submitForm_2() {
    // Lấy thông tin người dùng đã đăng nhập từ localStorage
    var loggedInUser = localStorage.getItem('loggedInUser');
  
    if (!loggedInUser) {
        // Nếu người dùng chưa đăng nhập, hiển thị modal đăng nhập
        $('#loginModal').modal('show');
        return; // Dừng hàm submitForm ở đây để ngăn việc gửi dữ liệu khi chưa đăng nhập
    }
  
    // Hiển thị modal loading
    $('#loadingModal').modal('show');
  
    var c_ty = document.getElementById('c_ty').value;
    var ngay_nghi = document.getElementById('ngay_nghi').value || getCurrentDate();
    var ghi_chu = document.getElementById('ghi_chu').value;
  
    if (!c_ty || !ngay_nghi) {
        $('#errorModal').modal('show'); // Hiển thị modal lỗi
        $('#loadingModal').modal('hide'); // Ẩn modal loading
        return;
    }
  
    var formData = {
        sheetName: 'Sheet2',
        user: loggedInUser, // Thêm thông tin người dùng đăng nhập vào đây
        c_ty: c_ty,
        ngay_nghi: ngay_nghi,
        ghi_chu: ghi_chu  
    };
  
    console.log(formData);
    fetch('https://script.google.com/macros/s/AKfycbzg9lkoiVZeVE7kXcDV7gVa7lijeXjP-tAHukkv4lac5fXNzBJNOLYQEiSyu9cVgkmy/exec', {
        method: 'POST',
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.result === 'success') {
            // Hiển thị modal thành công
            $('#successModal').modal('show');
  
            // Tự động đóng modal sau 2 giây
            setTimeout(function () {
                $('#successModal').modal('hide');
            }, 2000);
  
            // Reset form
            document.getElementById('registrationForm').reset();
        } else {
            // Hiển thị modal lỗi
            $('#errorModal').modal('show');
        }
    })
    .catch(error => {
        console.error('Đã xảy ra lỗi:', error);
        $('#errorModal').modal('show'); // Hiển thị modal lỗi
    })
    .finally(() => {
        // Ẩn modal loading sau khi hoàn thành
        $('#loadingModal').modal('hide');
    });
  }
  */