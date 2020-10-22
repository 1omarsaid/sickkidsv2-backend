const { db } = require('../util/admin');

exports.getAllTodos = (request, response) => {
	db
		.collection('cf')
        .orderBy('createdAt', 'desc')
        .limit(3)
        .get()
		.then((data) => {
			let todos = [];
			data.forEach((doc) => {
				todos.push({
                    todoId: doc.id,
                    case: doc.data().case,
                    nso: doc.data().nso,
                    patientName: doc.data().patientName,
                    hsc:doc.data().hsc,
                    pedigree: doc.data().pedigree,
                    dob: doc.data().dob,
                    doc: doc.data().doc,
                    ageAtCollection: doc.data().ageAtCollection,
                    reportDate: doc.data().reportDate,
                    labAnomalies: doc.data().labAnomalies,
                    screenCondition: doc.data().screenCondition,
                    tpn: doc.data().tpn,
                    prem: doc.data().prem,
                    nicu: doc.data().nicu,
                    gestationalAge: doc.data().gestationalAge,
                    birthWeight: doc.data().birthWeight,
                    irt: doc.data().irt,
                    cftr: doc.data().cftr,
                    category: doc.data().category,
                    nbs: doc.data().nbs,
                    dateOfFirstContact: doc.data().dateOfFirstContact,
                    dateOfDiagnostic: doc.data().dateOfDiagnostic,
                    placeOfDiagnostic: doc.data().placeOfDiagnostic,
                    confirmatory: doc.data().confirmatory,
                    notes: doc.data().notes,
                    dateOfDecision: doc.data().dateOfDecision,
                    cheo: doc.data().cheo,
                    cfMotherTesting: doc.data().cfMotherTesting,
                    cfFatherTesting: doc.data().cfFatherTesting,
					createdAt: doc.data().createdAt,
				});
			});
			return response.json(todos);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code});
		});
};

exports.postOneTodo = (request, response) => {
    // we only need this for the HSC number 
    console.log(request.body)
	if (request.body.case === '') {
		return response.status(400).json({ case: 'Case must not be empty!' });
    }
    
    if(request.body.hsc === '') {
        return response.status(400).json({ hsc: 'HSC must not be empty!' });
    }

    if(request.body.patientName === '') {
        return response.status(400).json({ patientName: 'Name must not be empty!' });
    }
    
    // will be updated for our patients data
    const newTodoItem = {
        case: request.body.case,
        nso: request.body.nso,
        patientName: request.body.patientName,
        hsc:request.body.hsc,
        pedigree: request.body.pedigree,
        dob: request.body.dob,
        doc: request.body.doc,
        ageAtCollection: request.body.ageAtCollection,
        reportDate: request.body.reportDate,
        labAnomalies: request.body.labAnomalies,
        screenCondition: request.body.screenCondition,
        tpn: request.body.tpn,
        prem: request.body.prem,
        nicu: request.body.nicu,
        gestationalAge: request.body.gestationalAge,
        birthWeight: request.body.birthWeight,
        irt: request.body.irt,
        cftr: request.body.cftr,
        category: request.body.category,
        nbs: request.body.nbs,
        dateOfFirstContact: request.body.dateOfFirstContact,
        dateOfDiagnostic: request.body.dateOfDiagnostic,
        placeOfDiagnostic: request.body.placeOfDiagnostic,
        confirmatory: request.body.confirmatory,
        notes: request.body.notes,
        dateOfDecision: request.body.dateOfDecision,
        cheo: request.body.cheo,
        cfMotherTesting: request.body.cfMotherTesting,
        cfFatherTesting: request.body.cfFatherTesting,
        createdAt: new Date().toISOString()
    }
    db
        .collection('cf')
        .add(newTodoItem)
        .then((doc)=>{
            const responseTodoItem = newTodoItem;
            responseTodoItem.id = doc.id;
            return response.json(responseTodoItem);
        })
        .catch((err) => {
			response.status(500).json({ error: 'Something went wrong' });
			console.error(err);
		});
};

exports.deleteTodo = (request, response) => {
    const document = db.doc(`/cf/${request.params.todoId}`);
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return response.status(404).json({ error: 'Todo not found' })
            }
            return document.delete();
        })
        .then(() => {
            response.json({ message: 'Delete successfull' });
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};

exports.editTodo = ( request, response ) => { 
    if(request.body.todoId || request.body.createdAt){
        response.status(403).json({message: 'Not allowed to edit'});
    }
    let document = db.collection('cf').doc(`${request.params.todoId}`);
    document.update(request.body)
    .then(()=> {
        response.json({message: 'Updated successfully'});
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ 
                error: err.code 
        });
    });
};

exports.getOneTodo = (request, response) => {
    console.log(request.params.todoId)
	db
		.collection('cf')
        .where("hsc", "==", request.params.todoId)
        .get()
		.then((doc) => {
			if (!doc.exists) {
				return response.status(404).json(
                    { 
                        error: 'Todo not found' 
                    });
			}
			TodoData = doc.data();
			TodoData.todoId = doc.id;
			return response.json(TodoData);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: error.code });
		});
};