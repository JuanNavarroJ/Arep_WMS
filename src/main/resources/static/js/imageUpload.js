const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dja8smkgx/image/upload';

const CLOUDINARY_PRESETS = 'b059hpk6';

const CLOUDINARY_PRESETS_2 = 'ml_default';

/**
 * Subir imagen principal del producto
 * 
 */
const imagePreview = document.getElementById('img-preview');
const mainImageUploader = document.getElementById('selectMainImage');
const mainUploadBar = document.getElementById('main-bar');

mainImageUploader.addEventListener('change', async (e) => {
	var file = e.target.files[0];
	
	var formData = new FormData();
	formData.append('file', file);
	formData.append('upload_preset', CLOUDINARY_PRESETS);
	
	var res = await axios.post(CLOUDINARY_URL, formData, {
		headers: {
			'Content-Type': 'multipart/form-data'
		},
                onUploadProgress(e){
                    
                    var progress = (e.loaded * 100) / e.total;
                    mainUploadBar.setAttribute('aria-valuenow', progress);
                    mainUploadBar.style.width = progress+"%";
                    
                    
                }
	});
	
        
	//console.log(res.data);
	//console.log(res.data.secure_url);
        mainUploadBar.className = "progress-bar bg-success";
        imagePreview.src = res.data.secure_url;
        document.getElementById('upMainImage').value = res.data.version+"/"+res.data.public_id+"."+res.data.format;
        
		
});

/**
 * Subir imagen 2 del producto
 */
const imageSecondPreview = document.getElementById('imgSecond-preview');
const SecondImageUploader = document.getElementById('selectSecondImage');
const secondUploadBar = document.getElementById('second-bar');

SecondImageUploader.addEventListener('change', async (e) => {
	var file = e.target.files[0];
	
	var formData = new FormData();
	formData.append('file', file);
	formData.append('upload_preset', CLOUDINARY_PRESETS);
	
	var res = await axios.post(CLOUDINARY_URL, formData, {
		headers: {
			'Content-Type': 'multipart/form-data'
		},
                onUploadProgress(e){
                    
                    var progress = (e.loaded * 100) / e.total;
                    secondUploadBar.setAttribute('aria-valuenow', progress);
                    secondUploadBar.style.width = progress+"%";
                    
                    
                }
	});
	
        secondUploadBar.className = "progress-bar bg-success";
        imageSecondPreview.src = res.data.secure_url;
        document.getElementById('upSecondImage').value = res.data.version+"/"+res.data.public_id+"."+res.data.format;
        
		
});

/**
 * Subir imagen 3 del producto
 */
const imageThirdPreview = document.getElementById('imgThird-preview');
const thirdImageUploader = document.getElementById('selectThirdImage');
const thirdUploadBar = document.getElementById('third-bar');

thirdImageUploader.addEventListener('change', async (e) => {
	var file = e.target.files[0];
	
	var formData = new FormData();
	formData.append('file', file);
	formData.append('upload_preset', CLOUDINARY_PRESETS);
	
	var res = await axios.post(CLOUDINARY_URL, formData, {
		headers: {
			'Content-Type': 'multipart/form-data'
		},
                onUploadProgress(e){
                    
                    var progress = (e.loaded * 100) / e.total;
                    thirdUploadBar.setAttribute('aria-valuenow', progress);
                    thirdUploadBar.style.width = progress+"%";
                    
                    
                }
	});
	
        
        thirdUploadBar.className = "progress-bar bg-success";
        imageThirdPreview.src = res.data.secure_url;
        document.getElementById('upThirdImage').value = res.data.version+"/"+res.data.public_id+"."+res.data.format;
        
		
});

