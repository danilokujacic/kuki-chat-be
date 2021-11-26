const { Router } = require('express');
const PreferenceRouter = Router();
const PreferenceModel = require('../models/preferences/preference');

const defaultPreferences = {
    chatBubbleColor: 'blue',
};

PreferenceRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    const pref = await PreferenceModel.find({ id });

    if (pref.length) {
        return res.json(pref);
    }

    const newPref = new PreferenceModel({
        id,
        preferences: defaultPreferences,
    });
    await newPref.save();

    return res.json(await PreferenceModel.find({ id }));
});
PreferenceRouter.post('/:id', async (req, res) => {
    const { preferences } = req.body;
    const { id } = req.params;

    const user = await PreferenceModel.findOneAndUpdate(
        { id },
        { preferences: { chatBubbleColor: preferences.chatBubbleColor } },
    );

    if (user) {
        return res.json(user);
    }
});

module.exports = { path: '/preferences', router: PreferenceRouter };
