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