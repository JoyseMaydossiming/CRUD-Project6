var express = require('express');
var router = express.Router();
 
/* GET supplier page. */
 
router.get('/', function(req, res, next) {
 req.getConnection(function(err,connection){
 var query = connection.query('SELECT * FROM supplier',function(err,rows)
 {
 if(err)
 var errornya  = ("Error Selecting : %s ",err );   
 req.flash('msg_error', errornya);   
 res.render('supplier/list',{title:"Supplier",data:rows});
 });
     });
});var express = require('express');
var router = express.Router();

/* GET supplier page. */

router.get('/', function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM supplier',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('supplier/list',{title:"Supplier",data:rows});
		});
     });
});

router.post('/add', function(req, res, next) {
	req.assert('nama_supplier', 'Please fill the nama_supplier').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {

		v_kode_supplier = req.sanitize( 'kode_supplier' ).escape().trim();
		v_nama_supplier = req.sanitize( 'nama_supplier' ).escape().trim(); 
		v_alamat = req.sanitize( 'alamat' ).escape().trim();
		v_email = req.sanitize( 'email' ).escape().trim();
        v_phone = req.sanitize( 'phone' ).escape();

		var supplier = {
            kode_supplier: v_kode_supplier,
            nama_supplier: v_nama_supplier,
            alamat: v_alamat,
			email: v_email,
			phone: v_phone
		}

		var insert_sql = 'INSERT INTO supplier SET ?';
		req.getConnection(function(err,connection){
			var query = connection.query(insert_sql, supplier, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('supplier/add-supplier', 
					{ 
						kode_supplier: req.param('kode_supplier'),
                        nama_supplier: req.param('nama_supplier'), 
                        alamat: req.param('alamat'),
                        email: req.param('email'),
						phone: req.param('phone'),
					});
				}else{
					req.flash('msg_info', 'Create supplier success'); 
					res.redirect('/supplier');
				}		
			});
		});
	}else{
		console.log(errors);
		errors_detail = "Sory there are error<ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('supplier/add-supplier', 
		{ 
			nama_supplier: req.param('nama_supplier'), 
			email: req.param('email'),
		});
	}

});

router.get('/add', function(req, res, next) {
	res.render(	'supplier/add-supplier', 
	{ 
        title: 'Add New Supplier',
        kode_supplier: '',
        nama_supplier: '',
        alamat: '',
		email: '',
		phone:''
	});
});

router.get('/edit/(:kode_supplier)', function(req,res,next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM supplier where kode_supplier='+req.params.kode_supplier,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/supplier'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "Supplier can't be find!"); 
					res.redirect('/supplier');
				}
				else
				{	
					console.log(rows);
					res.render('supplier/edit',{title:"Edit ",data:rows[0]});

				}
			}

		});
	});
});
router.put('/edit/(:kode_supplier)', function(req,res,next){
	req.assert('nama_supplier', 'Please fill the nama_supplier').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
        v_kode_supplier = req.sanitize( 'kode_supplier' ).escape().trim();
		v_nama_supplier = req.sanitize( 'nama_supplier' ).escape().trim(); 
		v_alamat = req.sanitize( 'alamat' ).escape().trim();
		v_email = req.sanitize( 'email' ).escape().trim();
        v_phone = req.sanitize( 'phone' ).escape();

		var supplier = {
            kode_supplier: v_kode_supplier,
            nama_supplier: v_nama_supplier,
            alamat: v_alamat,
			email: v_email,
			phone: v_phone
		}

		var update_sql = 'update supplier SET ? where kode_supplier = '+req.params.kode_supplier;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, supplier, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('supplier/edit', 
					{ 
                        kode_supplier: req.param('kode_supplier'),
                        nama_supplier: req.param('nama_supplier'), 
                        alamat: req.param('alamat'),
                        email: req.param('email'),
						phone: req.param('phone'),
					});
				}else{
					req.flash('msg_info', 'Update supplier success'); 
					res.redirect('/supplier/edit/'+req.params.kode_supplier);
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "Sory there are error<ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('supplier/add-supplier', 
		{ 
			nama_supplier: req.param('nama_supplier'), 
			email: req.param('email')
		});
	}
});

router.delete('/delete/(:kode_supplier)', function(req, res, next) {
	req.getConnection(function(err,connection){
		var supplier = {
			kode_supplier: req.params.kode_supplier,
		}
		
		var delete_sql = 'delete from supplier where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, supplier, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/supplier');
				}
				else{
					req.flash('msg_info', 'Delete Supplier Success'); 
					res.redirect('/supplier');
				}
			});
		});
	});
});
module.exports = router;