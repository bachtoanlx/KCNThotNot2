

  //Xử lý hành động gửi dữ liệu vào GG Sheet1 (gửi số nước)
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
 

// Xử lý hành động gửi dữ liệu vào GG Sheet2 (gửi thông báo nghỉ)
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